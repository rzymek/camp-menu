import {useMemo} from "react"
import {ShoppingListByCategory, shoppingList} from "./shoppingList"
import {mealList} from "./mealList"
import {useMeals} from "./useMeals"
import {omit, round} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"
import useLocalStorage from "use-local-storage"
import {ShoppingListItem} from "./shoppingListItem.tsx"

function useShoppingList(plan: Plan[]) {
    const meals = useMeals()

    return useMemo(() =>
            shoppingList(mealList(plan), meals),
        [plan, meals])
}

export function ShoppingList(props: { plan: Plan[] }) {
    const list = useShoppingList(props.plan)
    return <ShoppingListView list={list} storagePrefix="shopping-list"/>
}

export function ShoppingListView(props: { list: ShoppingListByCategory, storagePrefix: string }) {
    const [state = {}, setState] = useLocalStorage<Record<string, number>>(props.storagePrefix, {})
    return <div style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
        alignItems: "center",
        width: "fit-content",
        overflow: "auto",
        position: 'relative',
    }}>
        {Object.entries(props.list).map(([category, items]) =>
            <>
                <i style={{fontSize:'80%', gridColumn: 'span 3', marginTop: 8}} key={category}>{category}:</i>
                {items.map(item => [
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
            </>)}
    </div>
}

function id(item: ShoppingListItem) {
    return `${item.category}/${item.name}`
}