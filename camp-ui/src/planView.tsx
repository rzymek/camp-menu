import {range} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

export function PlanView(props: { plan: Plan[] }) {
    const {plan} = props;
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
                <div style={{display:'grid', gridTemplateColumns: '1fr 0fr', width: '100%', gap: 4, alignItems:'center'}}>
                {day.meals[section]?.map((r,idx) => [
                    <div key={`name:${r.name}.${idx}`}>{r.name}</div>,
                    <div key={`count:${r.name}.${idx}`}>{r.count}</div>
                ])}
                </div>
            </td>)}
        </tr>)}
        </tbody>
    </table>
}