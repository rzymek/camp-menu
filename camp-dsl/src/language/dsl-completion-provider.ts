import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature} from "langium/lsp"
import {CompletionItemKind} from "vscode-languageserver-types"

export class DslCompletionProvider extends DefaultCompletionProvider {
    private items: string[] = ['initial'];
    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor) {
        console.log("completionFor", next.type, next.property, context)

        if(next.type === 'Recipe' && next.property === 'name') {
            this.items.forEach(meal => {
                acceptor(context, {
                    label: meal,
                    kind: CompletionItemKind.Text,
                    detail: 'Keyword',
                })
            })
            return;
        }
        return super.completionFor(context, next, acceptor)
    }

    update(items: string[]): void {
        this.items = items;
    }
}