import {useMemo} from "react"
import {shoppingList} from "./shoppingList"
import {mealList} from "./mealList"
import {useMeals} from "./useMeals"
import {flat, omit, round} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"
import useLocalStorage from "use-local-storage"

function useShoppingList(plan: Plan[]) {
    const meals = useMeals()

    return useMemo(() =>
            shoppingList(mealList(plan), meals),
        [plan, meals])
}

export function ShoppingList(props: { plan: Plan[] }) {
    const list = useShoppingList(props.plan)
    return <ShoppingListView list={flat(list)} storagePrefix="shopping-list"/>
}

interface ShoppingListItem {
    name: string,
    quantity: number,
    unit: string
}

export function ShoppingListView(props: { list: ShoppingListItem[], storagePrefix:string }) {
    const [state = {}, setState] = useLocalStorage<Record<string, number>>(props.storagePrefix, {})
    return <div style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
        alignItems: "start",
        width: "fit-content",
        overflow: "auto",
    }}>
        <button style={{position: "absolute", right: 8, width: "1cm", height: "1cm"}}
                onClick={() => setState({})}>
            X
        </button>
        {props.list.map(item => [
                <input id={id(item)} key={`check:${id(item)}`} type="checkbox"
                       checked={state[item.name] === item.quantity}
                       onChange={e => e.currentTarget.checked
                           ? setState({...state, [item.name]: item.quantity})
                           : setState(omit(state, [item.name]))}/>,
                <label htmlFor={id(item)} key={`name:${id(item)}`} style={{padding: 4}}>
                    {item.name}
                </label>,
                <label htmlFor={id(item)} key={`quantity:${id(item)}`} style={{paddingLeft: "1cm"}}>
                    {round(item.quantity, 2)} {item.unit}
                </label>,
            ],
        )}
    </div>
}

function id(item: ShoppingListItem) {
    return `${item.name}/${item.quantity}/${item.unit}`
}
