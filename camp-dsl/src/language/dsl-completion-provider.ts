import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature} from "langium/lsp"

export class DslCompletionProvider extends DefaultCompletionProvider {
    private items: string[] = [""]

    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor) {
        if (next.type === "Recipe" && next.property === "name") {
            this.items.forEach(meal => acceptor(context, {
                label: meal,
            }))
        } else if (next.property === "day") {
            daysOfWeek.forEach((it, idx) => acceptor(context, {
                label: it,
                sortText: `${idx}`,
            }))
        } else if (next.property === "count") {
            [1,2,3,4,5,6,7,8,9].forEach(it => acceptor(context, {
                label: `${it}`,
            }))
        }
    }

    update(items: string[]): void {
        this.items = items
    }
}

const daysOfWeek = function () {
    const baseDate = new Date(2023, 0, 2) // Jan 1, 2023 (a Sunday)
    const daysOfWeek: string[] = []
    for (let i = 0; i < 7; i++) {
        const dayName = baseDate.toLocaleDateString(undefined, {weekday: "long"})
        baseDate.setDate(baseDate.getDate() + 1);
        daysOfWeek.push(dayName)
    }
    return daysOfWeek
}()