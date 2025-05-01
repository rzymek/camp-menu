import {beforeAll, describe, expect, test} from "vitest"
import {EmptyFileSystem, type LangiumDocument} from "langium"
import {expandToString as s} from "langium/generate"
import {parseHelper} from "langium/test"
import {createDslServices} from "../../src/language/dsl-module.js"
import {Count, Model} from "../../src/language/generated/ast.js"
import {checkDocumentValid} from "../checkDocumentValid.js"

let services: ReturnType<typeof createDslServices>
let parse: ReturnType<typeof parseHelper<Model>>
let document: LangiumDocument<Model> | undefined

beforeAll(async () => {
    services = createDslServices(EmptyFileSystem)
    parse = parseHelper<Model>(services.Dsl)

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

describe("Parsing tests", () => {

    test("parse simple model", async () => {
        const src: string = s`
            czwartek (4):
                quesadilla
            piątek (4):
                jajecznica z pomidorami
                tosty
                hamburger (5), hamburger wege (1)
            sobota:
                szakszuka (6)
                curry wurst (5), curry wurst wege (1)
                chilli con carne (5), burger wege (1)
            niedziela (6):
                jajecznica z pomidorami
                tosty (5), tosty wege (1)
                prażonka (6)
            poniedziałek:
                jajecznica z pomidorami (6)
                quesadilla (5), quesadilla wege (1)
        `
        document = await parse(src)

        const result: Model = document.parseResult.value
        expect(
            checkDocumentValid(document) || result.plan.reduce((acc, it) => ({
                [`${it.day}${count(it.count)}`]: it.meals.map(meal => meal.recipies.map(it => `${it.name}${count(it.count)}`)),
                ...acc,
            }), {})
            ,
        ).toEqual({
            "czwartek (4)": [
                ["quesadilla"],
            ],
            "niedziela (6)": [
                ["jajecznica z pomidorami"],
                ["tosty (5)", "tosty wege (1)"],
                ["prażonka (6)"],
            ],
            "piątek (4)": [
                ["jajecznica z pomidorami"],
                ["tosty"],
                ["hamburger (5)", "hamburger wege (1)"],
            ],
            "poniedziałek": [
                ["jajecznica z pomidorami (6)"],
                ["quesadilla (5)", "quesadilla wege (1)"],
            ],
            "sobota": [
                ["szakszuka (6)"],
                ["curry wurst (5)", "curry wurst wege (1)"],
                ["chilli con carne (5)", "burger wege (1)"],
            ],
        })
    })
})

function count(v: Count | undefined): string {
    return v ? "(" + v?.count + ")" : ""
}