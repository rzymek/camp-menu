import "./app.css"
import {useState} from "preact/compat"
import {Tab, Tabs} from "./tabs.tsx"
import {ShoppingList} from "./shoppingList.tsx"
import {DayList} from "./dayList.tsx"
import {Plan} from "../../camp-dsl/src/api/parser.ts"
import {PlanEditor} from "./planEditor.tsx"

export function App() {
    const [plan, setPlan] = useState<Plan[]>([])
    return <Tabs style={{position: "absolute", inset: 0}}>
        <Tab name="Plan">
            <PlanEditor onChange={setPlan}/>
        </Tab>
        <Tab name="Zakupy">
            <ShoppingList plan={plan}/>
        </Tab>
        {plan.map(day => <Tab key={day.day} name={day.day}>
            <DayList meals={day.meals}/>
        </Tab>)}
    </Tabs>
}

