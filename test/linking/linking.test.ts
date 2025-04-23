import {afterEach, beforeAll, describe, expect, test} from "vitest"
import {EmptyFileSystem, type LangiumDocument} from "langium"
import {expandToString as s} from "langium/generate"
import {clearDocuments, parseHelper} from "langium/test"
import {createDslServices} from "../../src/language/dsl-module.js"
import {Model} from "../../src/language/generated/ast.js"
import {checkDocumentValid} from "../checkDocumentValid.js"

let services: ReturnType<typeof createDslServices>;
let parse:    ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createDslServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.Dsl);

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

afterEach(async () => {
    document && clearDocuments(services.shared, [ document ]);
});

describe('Linking tests', () => {

    test('linking of greetings', async () => {
        document = await parse(`
            person Langium
            Hello Langium!
        `);

        expect(
            checkDocumentValid(document)
                || document.parseResult.value.greetings.map(g => g.person.ref?.name || g.person.error?.message).join('\n')
        ).toBe(s`
            Langium
        `);
    });
});
