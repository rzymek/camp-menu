import {MonacoEditorLanguageClientWrapper, UserConfig} from 'monaco-editor-wrapper';
import {configureWorker, defineUserServices} from './setupCommon.js';
import monarchSyntax from "./syntaxes/dsl.monarch.js";

type Options = {
    code: string
    onChange(value: string):Promise<void>;
};

export function setupConfigClassic(opts: Options): UserConfig {
    return {
        wrapperConfig: {
            serviceConfig: defineUserServices(),
            editorAppConfig: {
                $type: 'classic',
                languageId: 'dsl',
                code: opts.code,
                useDiffEditor: false,
                languageExtensionConfig: {id: 'langium'},
                languageDef: monarchSyntax,
                editorOptions: {
                    'semanticHighlighting.enabled': true,
                    theme: 'vs-dark',
                    lineNumbers: 'off',
                    glyphMargin: false,
                    lineDecorationsWidth: 0,
                    automaticLayout: true,
                    minimap: {
                        enabled: false,
                    },
                },
            },
        },
        languageClientConfig: configureWorker(),
    };
}

export interface DslEditorInstance {
    dispose(): Promise<void>;
}

export async function executeClassic(htmlElement: HTMLElement, options:Options): Promise<DslEditorInstance> {
    const userConfig = setupConfigClassic(options);
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(userConfig, htmlElement);
    const editor = wrapper.getEditor();
    if(!editor){
        throw new Error('Editor is undefined');
    }
    editor.onDidChangeModelContent(() => {
        options.onChange(editor.getValue());
    })
    options.onChange(options.code).then();
    return wrapper;
}
