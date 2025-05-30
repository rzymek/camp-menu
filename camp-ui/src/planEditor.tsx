import {Plan} from "../../camp-dsl/src/api/parser.ts"
import {useState} from "react"
import {DslEditor} from "../../camp-dsl/src"
import {PlanView} from "./planView.tsx"
import {MealsProvider} from "./meals.ts"
import {filter, first, pipe} from "remeda"
import {DangerousButton} from "./dangerousButton.tsx"

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

const initial = pipe(
    [
        decodeURIComponent(location.search.replace(/^[?]src=/, "")),
        localStorage.getItem("src"),
        demoSrc,
    ],
    filter(it => !!it),
    first(),
)!


export function PlanEditor(props: { onChange: (plan: Plan[]) => void }) {
    const [plan, setPlan] = useState<Plan[]>([])
    const [src, setSrc] = useState(initial)
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <div style={{flex: 2, display: "flex", flexDirection: "row"}}>
            <DslEditor onChange={(value, text) => {
                setPlan(value)
                props.onChange(value)
                setTimeout(() => {
                    history.replaceState(null, "", `?src=${encodeURIComponent(text)}`)
                    localStorage.setItem("src", text)
                }, 0)
            }} importMetaUrl={import.meta.url} external={external}>
                {src}
            </DslEditor>
        </div>
        <div style={{flex: 1, padding: 8, overflow: "auto"}}>
            <PlanView plan={plan}/>
            <DangerousButton onClick={() => {
                localStorage.clear()
                setSrc("")
            }}>Reset</DangerousButton>
            <a href="meals.html" style={{margin: 8}}>Przepisy</a>
            <a href="https://github.com/rzymek/camp-menu/blob/main/camp-ui/src/meals.md" target="_blank"
               style={{margin: 8}}>Źródło</a>
        </div>
    </div>

}