import {Recipe} from "../../meal-dsl/src/api/parser.ts"
import {MealList} from "./mealList.ts"
import {entries, first, flatMap, groupBy, map, pipe, sortBy, values} from "remeda"

function createIndex<T>(array: T[], keyExtractor: (x: T) => string): Map<string, T> {
    const map = new Map<string, T>()
    array.forEach(it => {
        map.set(keyExtractor(it), it)
    })
    return map
}

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