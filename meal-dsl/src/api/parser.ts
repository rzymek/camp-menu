import {createDslServices} from "../language/dsl-module.js"
import {EmptyFileSystem, LangiumDocument} from "langium"
import {parseHelper} from "langium/test"
import {Model} from "../language/generated/ast.js"

export interface Recipe {
    title: string;
    items: { name: string; quantity: number; unit: string }[];
    equipment: { desc: string }[]
}

function throwOnFailure(result: LangiumDocument<Model>): void {
    const errors = [
        ...result.parseResult.parserErrors,
        ...result.parseResult.lexerErrors,
    ];
    if(errors.length > 0) {
        throw new Error(errors.map(e => e.message).join('\n'));
    }
}

export async function recipes(src: string): Promise<Recipe[]> {
    const parser = createParser()
    const result = await parser(src)
    throwOnFailure(result)
    const {recipies} = result.parseResult.value
    return recipies.map(recipe => ({
        title: recipe.header.title.trim(),
        items: recipe.items.map(item => ({
            name: item.name.trim(),
            quantity: item.quantity.value,
            unit: item.quantity.unit.trim(),
        } as const)),
        equipment: recipe.equipment.map(it => ({
            desc: it.desc.trim(),
        } as const)),
    } as const))
}

export function createParser() {
    const services = createDslServices(EmptyFileSystem)
    return parseHelper<Model>(services.Dsl)
}