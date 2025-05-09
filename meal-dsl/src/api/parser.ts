import {createDslServices} from "../language/dsl-module.js"
import {EmptyFileSystem, LangiumDocument} from "langium"
import {parseHelper} from "langium/test"
import {Category, Model} from "../language/generated/ast.js"
import * as _ from "remeda"

export interface Meals {
    recipes: Recipe[],
    categories: string[],
}
export interface Recipe {
    title: string;
    items: {
        name: string;
        quantity: number;
        unit: string,
        category: string;
    }[];
    equipment: { desc: string }[],
}

function throwOnFailure(result: LangiumDocument<Model>): void {
    const errors = [
        ...result.parseResult.parserErrors,
        ...result.parseResult.lexerErrors,
    ]
    if (errors.length > 0) {
        throw new Error(errors.map(e => e.message).join("\n"))
    }
}

function reverseIndex(categories: Category[]) {
    return _.pipe(
        categories,
        _.flatMap(category => category.items.map(item => ({
            item: item.name.trim(),
            category: category.category,
        }))),
        _.groupBy(assoc => assoc.item),
        _.mapValues(([firstAndOnly]) => firstAndOnly.category),
    )
}

export async function recipes(src: string): Promise<Meals> {
    const parser = createParser()
    const result = await parser(src)
    throwOnFailure(result)
    const {recipies, categories} = result.parseResult.value
    const categoriesIndex = reverseIndex(categories)
    return {
        recipes: recipies.map(recipe => ({
            title: recipe.header.title.trim(),
            items: recipe.items.map(item => ({
                name: item.name.trim(),
                quantity: item.quantity.value,
                unit: item.quantity.unit.trim(),
                category: categoriesIndex[item.name.trim()] ?? "??",
            } as const)),
            equipment: recipe.equipment.map(it => ({
                desc: it.desc.trim(),
            } as const)),
        } as const)),
        categories: categories.map(category => category.category.trim()),
    }}

export function createParser() {
    const services = createDslServices(EmptyFileSystem)
    return parseHelper<Model>(services.Dsl)
}