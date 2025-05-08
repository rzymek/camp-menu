import {useMemo} from "preact/compat"
import {shoppingList} from "./shoppingList"
import {mealList} from "./mealList"
import {useMeals} from "./useMeals"
import {flat, round} from "remeda"
import {Plan} from "../../camp-dsl/src/api/parser.ts"

function useShoppingList(plan: Plan[]) {
    const meals = useMeals()

    return useMemo(() => {
        if (meals === undefined) {
            return []
        }
        return shoppingList(mealList(plan), meals)
    }, [plan, meals])
}

export function ShoppingList(props: { plan: Plan[] }) {
    const list = useShoppingList(props.plan)
    return <ShoppingListView list={flat(list)}/>
}

interface ShoppingListItem {
    name: string,
    quantity: number,
    unit: string
}

export function ShoppingListView(props: { list: ShoppingListItem[] }) {
    return <div style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
        alignItems: "center",
        width: "fit-content",
    }}>
        {props.list.map(item => [
                <input id={id(item)} key={`check:${id(item)}`} type="checkbox"/>,
                <label for={id(item)} key={`name:${id(item)}`} style={{padding: 4}}>
                    {item.name}
                </label>,
                <label for={id(item)} key={`quantity:${id(item)}`} style={{paddingLeft: "1cm"}}>
                    {round(item.quantity, 2)} {item.unit}
                </label>,
            ],
        )}
    </div>
}
function id(item: ShoppingListItem) {
    return `${item.name}/${item.quantity}/${item.unit}`;
}
