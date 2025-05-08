import "./app.css"
import {DslEditor} from "../../camp-dsl/src"
import {useEffect, useState} from "preact/compat"
import {MealsProvider} from "./meals.ts"
import {PlanView} from "./planView.tsx"
import {Tab, Tabs} from "./tabs.tsx"
import {ShoppingList} from "./shoppingList.tsx"
import {DayList} from "./dayList.tsx"
import {Plan} from "../../camp-dsl/src/api/parser.ts"
import useLocalStorageState from "use-local-storage-state"
import {pipe, filter, isNonNullish, first, map, concat} from "remeda"

const external = {
    MealProvider: () => new MealsProvider(),
} as const

const demoSrc = `
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

const initial = pipe(
    [location.search.replace(/^[?]src=/, "")],
    map(decodeURIComponent),
    concat([demoSrc]),
    filter(isNonNullish),
    first(),
)!;

function PlanEditor(props: { onChange: (plan: Plan[]) => void }) {
    const [src, setSrc] = useState<string>("")
    const [plan, setPlan] = useState<Plan[]>([])
    const [savedSrc, saveSrc] = useLocalStorageState("src", {
        defaultValue: initial,
    })
    useEffect(() => {
        setSrc(savedSrc)
    }, [])
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <div style={{flex: 2, display: "flex", flexDirection: "row"}}>
            <DslEditor onChange={(value, text) => {
                setPlan(value)
                props.onChange(value)
                saveSrc(text)
                history.replaceState(null, "", `?src=${encodeURIComponent(text)}`)
            }} importMetaUrl={import.meta.url} external={external}>
                {src || savedSrc}
            </DslEditor>
        </div>
        <div style={{flex: 1, padding: 8}}>
            <PlanView plan={plan}/>
        </div>
    </div>

}