import {AstNode} from "langium"
import {AbstractSemanticTokenProvider, SemanticTokenAcceptor} from "langium/lsp"
import {SemanticTokenTypes} from "vscode-languageserver-types"

export class DslSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
        console.log("highlightElement", node.$type)
        if (node.$type === "Plan") {
            acceptor({
                node,
                property: "day",
                type: SemanticTokenTypes.type,
            })
        } else if (node.$type === "Recipe") {
            acceptor({
                node,
                property: "name",
                type: SemanticTokenTypes.keyword,
            })
        } else if (node.$type === "Count") {
            acceptor({
                node,
                property: "count",
                type: SemanticTokenTypes.string,
            })
        }
    }
}