import {LangiumDocument} from "../../camp-dsl/src/ui/DslEditor.tsx"
import {Model} from "../../camp-dsl/src/language/generated/ast.ts"
import {range} from "remeda"

export function PlanView(props: { model: LangiumDocument<Model> }) {
    const {plan} = props.model.parseResult.value
    const maxSections = plan.reduce((acc, it) => Math.max(acc, it.meals.length), 0)
    return <table>
        <thead>
        <tr>
            {plan.map(day => <th key={day.day}>{day.day}</th>)}
        </tr>
        </thead>
        <tbody>
        {range(0, maxSections).map(section => <tr key={section}>
            {plan.map(day => <td key={day.day}>
                {day.meals[section]?.recipies.map(r => r.name).join(", ") ?? ""}
            </td>)}
        </tr>)}
        </tbody>
    </table>
}