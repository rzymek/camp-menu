import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature} from "langium/lsp"
// @ts-ignore
import {CompletionItemKind} from "vscode-languageserver-types"

export class DslCompletionProvider extends DefaultCompletionProvider {
    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor) {
        // console.log("completionFor", next.type, next.property, context)
        //     acceptor(context, {
        //         label: string,
        //         kind: CompletionItemKind.Text,
        //         detail: 'Keyword',
        //         sortText: '00' + label
        //     }));
        return super.completionFor(context, next, acceptor)
    }

}