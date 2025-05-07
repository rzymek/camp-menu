import "./app.css"
import {DslEditor} from "../../camp-dsl/src"
import {useEffect, useMemo, useState} from "preact/compat"
import {MealsProvider} from "./meals.ts"
import {Model} from "../../camp-dsl/src/language/generated/ast.ts"
import {LangiumDocument} from "camp-dsl/src/ui/DslEditor.tsx"
import {shoppingList} from "./shoppingList.ts"
import {mealList} from "./mealList.ts"
import {Recipe} from "../../meal-dsl/src/api/parser.ts"

const external = {
    MealProvider: () => new MealsProvider(),
} as const

const initial = `
czwartek (4):
    quesadilla
piątek (4):
    jajecznica z pomidorami
    tosty
    hamburger (5), hamburger wege (1)
sobota:
    szakszuka (6)
    curry wurst (5), curry wurst wege (1)
    chilli con carne (5), burger wege (1)
niedziela (6):
    jajecznica z pomidorami
    tosty (5), tosty wege (1)
    prażonka (6)
poniedziałek:
    jajecznica z pomidorami (6)
    quesadilla (5), quesadilla wege (1)
`.trim();

export function App() {
    const [result, setResult] = useState<LangiumDocument<Model>>()
    const meals = useMeals()
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <div style={{flex: 2, display: "flex", flexDirection: "row"}}>
            <div style={{flex: 2, display: "flex"}}>
                <DslEditor onChange={setResult} importMetaUrl={import.meta.url} external={external}>
                    {initial}
                </DslEditor>
            </div>
            <select multiple style={{flex: 1}}>
                {meals.map(meal => <option>{meal.title}</option>)}
            </select>
        </div>
        <div style={{flex: 1}}>
            {result && <ShoppingList model={result}/>}
        </div>
    </div>
}

function useMeals() {
    const [meals, setMeals] = useState<Recipe[]>([])
    useEffect(() => {
        new MealsProvider().getMeals().then(setMeals)
    }, [])
    return meals
}

function useShoppingList(model: LangiumDocument<Model>) {
    const meals = useMeals()

    return useMemo(() => {
        if (meals === undefined) {
            return []
        }
        return shoppingList(mealList(model), meals)
    }, [model, meals])
}

function ShoppingList(props: { model: LangiumDocument<Model> }) {
    const list = useShoppingList(props.model)
    return <div>
        {list.map(item => <div>{item.name} {item.quantity} {item.unit}</div>)}
    </div>
}

