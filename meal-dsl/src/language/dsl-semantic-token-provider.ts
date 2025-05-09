import {AstNode} from "langium"
import {AbstractSemanticTokenProvider, SemanticTokenAcceptor} from "langium/lsp"
import {SemanticTokenTypes} from "vscode-languageserver-types"

export class DslSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
        if (node.$type === "Plan") {
            acceptor({
                node,
                property: "day",
                type: SemanticTokenTypes.type,
            })
        } else if (node.$type === "Item") {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.keyword,
            })
        } else if (node.$type === "Recipe") {
            acceptor({
                node,
                property: "header",
                type: SemanticTokenTypes.comment,
            })
        } else if (node.$type === "ItemName") {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.keyword,
            })
        } else if (node.$type === "Category") {
            acceptor({
                node,
                property: "category",
                type: SemanticTokenTypes.string,
            })
        } else if (node.$type === "Quantity") {
            acceptor({
                node,
                property: "unit",
                type: SemanticTokenTypes.string,
            })
        }
    }
}