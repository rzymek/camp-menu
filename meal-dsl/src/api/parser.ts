import {createDslServices} from "../language/dsl-module.js"
import {EmptyFileSystem} from "langium"
import {parseHelper} from "langium/test"
import {Model} from "../language/generated/ast.js"

export interface Recipe {
    title: string;
    items: { name: string; quantity: number; unit: string }[];
    equipment: { desc: string }[]
}

export async function recipes(src: string): Promise<Recipe[]> {
    const parser = createParser()
    const result = await parser(src)
    const {recipies} = result.parseResult.value
    return recipies.map(recipe => ({
        title: recipe.header.title,
        items: recipe.items.map(item => ({
            name: item.name,
            quantity: item.quantity.value,
            unit: item.quantity.unit
        } as const)),
        equipment: recipe.equipment.map(it => ({
            desc: it.desc
        } as const)),
    } as const));
}

function createParser() {
    const services = createDslServices(EmptyFileSystem)
    return parseHelper<Model>(services.Dsl)
}