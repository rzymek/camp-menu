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

export function App() {
    const [result, setResult] = useState<LangiumDocument<Model>>()
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <DslEditor onChange={setResult} importMetaUrl={import.meta.url} external={external}>
            {``}
        </DslEditor>
        <div style={{flex: 1}}>
            {result && <ShoppingList model={result}/>}
        </div>
    </div>
}

function useShoppingList(model: LangiumDocument<Model>) {
    const [meals, setMeals] = useState<Recipe[]>()
    useEffect(() => {
        new MealsProvider().getMeals().then(setMeals)
    }, [])

    return useMemo(() => {
        if(meals === undefined) {
            return [];
        }
        return shoppingList(mealList(model), meals);
    }, [model, meals])
}

function ShoppingList(props: { model: LangiumDocument<Model> }) {
    const list = useShoppingList(props.model);
    return <div>
        {list.map(item => <div>{item.name} {item.quantity} {item.unit}</div>)}
    </div>
}

