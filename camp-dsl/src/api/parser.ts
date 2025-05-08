import {createDslServices} from "../language/dsl-module.js"
import {EmptyFileSystem, LangiumDocument} from "langium"
import {parseHelper} from "langium/test"
import {Model} from "../language/generated/ast.js"

export interface Plan {
    day: string;
    meals: {
        name: string;
        count: number;
    }[][];
}

export function createParser(): (text: string) => Promise<LangiumDocument<Model> & { plan: Plan[] }> {
    const services = createDslServices(EmptyFileSystem)
    const parser = parseHelper<Model>(services.Dsl)
    return async (src: string) => {
        const result = await parser(src)
        return {
            ...result,
            plan: result.parseResult.value?.plan.map(day => ({
                day: day.day,
                meals: day.meals.map(meal => meal.recipies.map(recipe => ({
                    name: recipe.name,
                    count: recipe.count?.count ?? day.count?.count ?? 0,
                }))),
            })) ?? [],
        }
    }
}