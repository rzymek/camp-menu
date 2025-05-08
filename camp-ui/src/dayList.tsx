import {ShoppingListView} from "./shoppingList.tsx"
import {useMeals} from "./useMeals.tsx"
import {createIndex} from "./createIndex.ts"
import {useMemo} from "preact/compat"
import {flatMap, map, pipe, unique} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

export function DayList(props: { meals: Plan["meals"] }) {
    const meals = useMeals()
    const planMeals = props.meals.filter(it => it.length > 0)
    const data = useMemo(() => {
        const mealsIndex = createIndex(meals, meal => meal.title)
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
        {data.map(section => <div>
            <h3>{section.title}</h3>
            <ShoppingListView list={section.list}/>
            <ul>
                {section.equipment.map(it => <li key={it}>{it}</li>)}
            </ul>
        </div>)}
    </div>
}