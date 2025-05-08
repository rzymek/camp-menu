import "./app.css"
import {DslEditor} from "../../camp-dsl/src"
import {useState} from "preact/compat"
import {MealsProvider} from "./meals.ts"
import {PlanView} from "./planView.tsx"
import {useMeals} from "./useMeals.tsx"
import {Tab, Tabs} from "./tabs.tsx"
import {ShoppingList} from "./shoppingList.tsx"
import {DayList} from "./dayList.tsx"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

const external = {
    MealProvider: () => new MealsProvider(),
} as const

const initial = `
czwartek (4):
    -
    -
    quesadilla
piątek (4):
    jajecznica z pomidorami
    tosty
    hamburgery (5), hamburgery wege (1)
sobota:
    szakszuka (6)
    curry wurst (5), curry wurst wege (1)
    chili con carne (5), hamburgery wege (1)
niedziela (6):
    jajecznica z pomidorami
    tosty (5), tosty wege (1)
    prażonka (6)
poniedziałek:
    jajecznica z pomidorami (6)
    quesadilla (5), quesadilla wege (1)
`.trim()

export function App() {
    const [plan, setPlan] = useState<Plan[]>([]);
    const meals = useMeals()
    return <Tabs style={{position: "absolute", inset: 0}}>
        <Tab name="Plan">
            <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
                <div style={{flex: 2, display: "flex", flexDirection: "row"}}>
                    <div style={{flex: 2, display: "flex"}}>
                        <DslEditor onChange={setPlan} importMetaUrl={import.meta.url} external={external}>
                            {initial}
                        </DslEditor>
                    </div>
                    <select multiple style={{flex: 1}}>
                        {meals.map(meal => <option>{meal.title}</option>)}
                    </select>
                </div>
                <div style={{flex: 1}}>
                    {plan && <PlanView plan={plan}/>}
                </div>
            </div>
        </Tab>
        <Tab name="Zakupy">
            <ShoppingList plan={plan}/>
        </Tab>
        {plan.map(day => <Tab key={day.day} name={day.day}>
            <DayList meals={day.meals}/>
        </Tab>)}
    </Tabs>
}