import {EmptyFileSystem} from "langium"
import {startLanguageServer} from "langium/lsp"
import {BrowserMessageReader, BrowserMessageWriter, createConnection} from "vscode-languageserver/browser.js"
import {createDslServices} from "./dsl-module.js"
import {UpdateCompletionDataNotification} from "./update-completion-data.js"
import {DslCompletionProvider} from "./dsl-completion-provider.js"

declare const self: DedicatedWorkerGlobalScope

const messageReader = new BrowserMessageReader(self)
const messageWriter = new BrowserMessageWriter(self)

const connection = createConnection(messageReader, messageWriter)

const { shared, Dsl } = createDslServices({ connection, ...EmptyFileSystem });

connection.onNotification(UpdateCompletionDataNotification, params => {
    const completionProvider = Dsl.lsp.CompletionProvider as DslCompletionProvider;
    completionProvider.update(params.items);
})

startLanguageServer(shared)
