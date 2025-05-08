import {ShoppingListView} from "./shoppingList.tsx"
import {Meals} from "../../camp-dsl/src/language/generated/ast.ts"
import {useMeals} from "./useMeals.tsx"
import {createIndex} from "./createIndex.ts"
import {useMemo} from "preact/compat"
import {flatMap, map, pipe, unique} from "remeda"

export function DayList(props: { meals: Meals[] }) {
    const meals = useMeals()
    const planMeals = props.meals.filter(it => it.recipies.length > 0);
    const data = useMemo(() => {
        const mealsIndex = createIndex(meals, meal => meal.title)
        return planMeals.map(meal => {
            const recipes = meal.recipies
                .map(r => mealsIndex.get(r.name)!)
                .filter(it => it)
            return ({
                title: meal.recipies.map(r => `${r.name} (${r.count?.count})`).join(", "),
                list: recipes.flatMap(it => it.items),
                equipment: pipe(recipes,
                    flatMap(it => it.equipment),
                    map(it => it.desc),
                    unique()
                )
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