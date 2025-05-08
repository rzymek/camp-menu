import {Recipe} from "../../meal-dsl/src/api/parser.ts"
import {MealList} from "./mealList.ts"
import {entries, first, flatMap, groupBy, map, pipe, sortBy, values} from "remeda"
import {createIndex} from "./createIndex.ts"

export function shoppingList(mealList: MealList, meals: Recipe[]) {
    const mealsIndex = createIndex(meals, meal => meal.title)
    return pipe(
        mealList,
        entries(),
        flatMap(([meal, count]) =>
            (mealsIndex.get(meal)?.items ?? []).map(item => ({
                name: item.name,
                quantity: item.quantity * count,
                unit: item.unit,
            })),
        ),
        groupBy(it => it.name),
        values(),
        map(it => ({
            name: first(it).name,
            quantity: it.reduce((acc, it) => acc + it.quantity, 0),
            unit: first(it).unit,
        })),
        sortBy(item => item.name)
    )
}