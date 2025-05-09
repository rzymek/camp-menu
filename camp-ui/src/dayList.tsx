import {ShoppingListView} from "./shoppingList.tsx"
import {useMeals} from "./useMeals.tsx"
import {createIndex} from "./createIndex.ts"
import {useMemo} from "react"
import {flatMap, groupBy, map, pipe, sortBy, unique, values} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

export function DayList(props: { meals: Plan["meals"] }) {
    const meals = useMeals()
    const planMeals = props.meals.filter(it => it.length > 0)
    const data = useMemo(() => {
        const mealsIndex = createIndex(meals.recipes, meal => meal.title)
        return planMeals.map(meal => {
            const recipes = meal
                .map(r => ({
                    recipe: mealsIndex.get(r.name)!,
                    people: r.count,
                }))
                .filter(it => it.recipe !== undefined)
            return ({
                title: meal.map(r => `${r.name} (${r.count})`).join(", "),
                list: pipe(recipes,
                    flatMap(it => it.recipe.items
                        .map(item => ({
                            ...item,
                            quantity: item.quantity * it.people,
                        })),
                    ),
                    groupBy(it => it.name),
                    values(),
                    map(byName => byName.reduce((acc, it) => ({
                        ...acc,
                        quantity: acc.quantity + it.quantity,
                    }))),
                    sortBy(item => meals.categories.indexOf(item.category), item => item.name),
                    groupBy(item => item.category),
                ),
                equipment: pipe(recipes,
                    flatMap(it => it.recipe.equipment),
                    map(it => it.desc),
                    unique(),
                ),
            })
        })
    }, [meals, planMeals])

    return <div style={{paddingBottom: 16}}>
        {data.map(section => <div key={section.title}>
            <h3>{section.title}</h3>
            <ShoppingListView list={section.list} storagePrefix={section.title}/>
            <ul>
                {section.equipment.map(it => <li key={it}>{it}</li>)}
            </ul>
        </div>)}
    </div>
}