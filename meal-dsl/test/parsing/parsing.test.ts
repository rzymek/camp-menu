import {beforeAll, describe, expect, test} from "vitest"
import {EmptyFileSystem, type LangiumDocument} from "langium"
import {expandToString as s} from "langium/generate"
import {parseHelper} from "langium/test"
import {createDslServices} from "../../src/language/dsl-module.js"
import {Model} from "../../src/language/generated/ast.js"
import {checkDocumentValid} from "../checkDocumentValid.js"
import * as fs from "node:fs/promises"

let services: ReturnType<typeof createDslServices>
let parse: ReturnType<typeof parseHelper<Model>>
// let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createDslServices(EmptyFileSystem)
    parse = parseHelper<Model>(services.Dsl)

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

describe("Parsing tests", () => {

    test("parse simple model", async () => {
        const meals = await fs.readFile(__dirname + "/../meals.md")
        const document: LangiumDocument<Model> = await parse(meals.toString())

        // check for absence of parser errors the classic way:
        //  deactivated, find a much more human readable way below!
        // expect(document.parseResult.parserErrors).toHaveLength(0);

        expect(
            // here we use a (tagged) template expression to create a human readable representation
            //  of the AST part we are interested in and that is to be compared to our expectation;
            // prior to the tagged template expression we check for validity of the parsed document object
            //  by means of the reusable function 'checkDocumentValid()' to sort out (critical) typos first;
            checkDocumentValid(document) || (document.parseResult.value?.
            recipies.map(recipe => s`
            # ${recipe.header.title}
            ${recipe.items.map(item => `* ${item.name}: ${item.quantity.value} ${item.quantity.unit}`).join('\n')}
            ${recipe.equipment.map(it => `+ ${it.desc}`).join('\n')}           
            `).join('\n')+
                document.parseResult.value?.
                categories.map(category => s`
            ${'\n'}${category.category}:
            ${category.items.map(item => `* ${item.name}`).join('\n')}
            `).join('\n')).replace(/\n+/g, '\n'),
        ).toEqual(`${meals}`.trim().replace(/\n+/g, '\n'))
    })
})

