import {beforeAll, describe, expect, test} from "vitest"
import {EmptyFileSystem, type LangiumDocument} from "langium"
import {parseHelper} from "langium/test"
import {createDslServices} from "../../src/language/dsl-module.js"
import {Model} from "../../src/language/generated/ast.js"
import {checkDocumentValid} from "../checkDocumentValid.js"
import {diagnosticToString} from "../diagnosticToString.js"
import fs from "node:fs/promises"

let services: ReturnType<typeof createDslServices>
let parse: ReturnType<typeof parseHelper<Model>>
let document: LangiumDocument<Model> | undefined

beforeAll(async () => {
    services = createDslServices(EmptyFileSystem)
    const doParse = parseHelper<Model>(services.Dsl)
    parse = (input: string) => doParse(input, {validation: true})

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

describe("Validating", () => {

    test("check no errors", async () => {
        const meals = await fs.readFile(__dirname + "/../../../camp-ui/public/meals.md")
        document = await parse(`${meals}`)

        expect(
            checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString),
        ).toEqual([])
        expect(document.parseResult.lexerErrors).toEqual([])
        expect(document.parseResult.parserErrors).toEqual([])
    })
})

