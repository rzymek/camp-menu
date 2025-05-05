import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature} from "langium/lsp"

export class DslCompletionProvider extends DefaultCompletionProvider {
    private items: string[] = ["initial"]

    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor) {
        console.log("completionFor", next.type, next.property, context)

        if (next.type === "Recipe" && next.property === "name") {
            this.items.forEach(meal => acceptor(context, {
                label: meal,
            }))
        } else if (next.property === "day") {
            console.log({daysOfWeek})
            daysOfWeek.forEach((it, idx) => acceptor(context, {
                label: it,
                sortText: `${idx}`,
            }))
        } else {
            return super.completionFor(context, next, acceptor)
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