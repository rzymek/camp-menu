import {LangiumDocument} from "../../camp-dsl/src/ui/DslEditor.tsx"
import {Model} from "../../camp-dsl/src/language/generated/ast.ts"
import {flatMap, groupBy, mapValues, pipe, sumBy} from "remeda"

export interface MealList {
    [meal: string]: number, //count
}

export function mealList(model: LangiumDocument<Model>): MealList {
    return pipe(
        model.parseResult.value.plan,
        flatMap(day => day.meals
            .flatMap(meal => meal.recipies.map(recipe => ({
                name: recipe.name,
                count: recipe.count ?? day.count,
            }))),
        ),
        groupBy(it => it.name),
        mapValues(it =>
            sumBy(it, it => it.count?.count ?? 0),
        ),
    )
}