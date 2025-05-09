import {Meals} from "../../meal-dsl/src/api/parser.ts"
import {MealList} from "./mealList.ts"
import {entries, first, flatMap, groupBy, map, pipe, sortBy, values} from "remeda"
import {createIndex} from "./createIndex.ts"
import {ShoppingListItem} from "./shoppingListItem.tsx"

export type ShoppingListByCategory = Record<string, ShoppingListItem[]>

export function shoppingList(mealList: MealList, meals: Meals): ShoppingListByCategory {
    const mealsIndex = createIndex(meals.recipes, meal => meal.title)
    return pipe(
        mealList,
        entries(),
        flatMap(([meal, count]) =>
            (mealsIndex.get(meal)?.items ?? []).map(item => ({
                ...item,
                quantity: item.quantity * count,
            })),
        ),
        groupBy(it => it.name),
        values(),
        map(it => ({
            name: first(it).name,
            quantity: it.reduce((acc, it) => acc + it.quantity, 0),
            unit: first(it).unit,
            category: first(it).category,
        })),
        sortBy(item => meals.categories.indexOf(item.category), item => item.name),
        groupBy(item => item.category),
    )
}