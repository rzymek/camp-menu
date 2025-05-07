import {LangiumDocument} from "../../camp-dsl/src/ui/DslEditor"
import {Model} from "../../camp-dsl/src/language/generated/ast"
import {useMemo} from "preact/compat"
import {shoppingList} from "./shoppingList"
import {mealList} from "./mealList"
import {useMeals} from "./useMeals"

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