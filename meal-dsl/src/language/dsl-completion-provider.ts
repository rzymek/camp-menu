import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature} from "langium/lsp"
// @ts-ignore
import {CompletionItemKind} from "vscode-languageserver-types"
import {Item, Model} from "./generated/ast.js"

export class DslCompletionProvider extends DefaultCompletionProvider {
    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor) {
        const value: Model = context.document.parseResult.value as Model
        console.log("completionFor", next.type, next.property, context)
        if (next.property === "name") {
            value.recipies.flatMap(r => r.items).map(i => i.name).forEach(label => {
                acceptor(context, {
                    label,
                    kind: CompletionItemKind.Text,
                    detail: "Keyword",
                })
            })
        } else if (next.property === "unit") {
            const unitForRecipeItem = (context.node?.$container as Item)?.name ?? ""
            let units = value.recipies
                .flatMap(r => r.items)
                .filter(i => i.name == unitForRecipeItem)
                .map(i => i.quantity.unit)
                .filter(it => !!it)

            if (units.length === 0) {
                units = value.recipies
                    .flatMap(r => r.items)
                    .map(i => i.quantity.unit)
                    .filter(it => !!it)
            }
            const uniq = new Set(units)
            uniq.forEach(label => {
                acceptor(context, {
                    label,
                    kind: CompletionItemKind.Text,
                    detail: "Keyword",
                })
            })
        }
    }

}