import {LangiumDocument} from "../../camp-dsl/src/ui/DslEditor"
import {Model} from "../../camp-dsl/src/language/generated/ast"
import {useMemo} from "preact/compat"
import {shoppingList} from "./shoppingList"
import {mealList} from "./mealList"
import {useMeals} from "./useMeals"
import {round} from "remeda"

function useShoppingList(model: LangiumDocument<Model>) {
    const meals = useMeals()

    return useMemo(() => {
        if (meals === undefined) {
            return []
        }
        return shoppingList(mealList(model), meals)
    }, [model, meals])
}

export function ShoppingList(props: { model: LangiumDocument<Model> }) {
    const list = useShoppingList(props.model)
    return <div style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
        alignItems: "center",
        width: "fit-content",
    }}>
        {list.map((item, idx) => ({
            ...item,
            id: `${item.name}.${idx}`,
        })).flatMap(({id, name, quantity, unit}) => [
                <input id={id} key={`check:${id}`} type="checkbox"/>,
                <label for={id} key={`name:${id}`} style={{padding: 4}}>
                    {name}
                </label>,
                <div key={`quantity:${id}`} style={{paddingLeft: "1cm"}}>
                    {round(quantity, 2)} {unit}
                </div>,
            ],
        )}
    </div>
}
