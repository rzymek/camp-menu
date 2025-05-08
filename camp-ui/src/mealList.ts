import {flat, flatMap, groupBy, mapValues, pipe, sumBy} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

export interface MealList {
    [meal: string]: number, //count
}

export function mealList(plan: Plan[]): MealList {
    return pipe(
        plan,
        flatMap(day => day.meals),
        flat(),
        groupBy(it => it.name),
        mapValues(it =>
            sumBy(it, it => it.count),
        ),
    )
}