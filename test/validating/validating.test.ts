import {beforeAll, describe, expect, test} from "vitest"
import {EmptyFileSystem, type LangiumDocument} from "langium"
import {expandToString as s} from "langium/generate"
import {parseHelper} from "langium/test"
import {createDslServices} from "../../src/language/dsl-module.js"
import {Model} from "../../src/language/generated/ast.js"
import {checkDocumentValid} from "../checkDocumentValid.js"
import {diagnosticToString} from "../diagnosticToString.js"

let services: ReturnType<typeof createDslServices>;
let parse:    ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createDslServices(EmptyFileSystem);
    const doParse = parseHelper<Model>(services.Dsl);
    parse = (input: string) => doParse(input, { validation: true });

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Validating', () => {
  
    test('check no errors', async () => {
        document = await parse(`
            person Langium
        `);

        expect(
            checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
        ).toHaveLength(0);
    });

    test('check capital letter validation', async () => {
        document = await parse(`
            person langium
        `);

        expect(
            checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
        ).toEqual(
            expect.stringContaining(s`
                [1:19..1:26]: Person name should start with a capital.
            `)
        );
    });
});

