import {useEffect, useState} from "preact/compat"
import {Recipe} from "../../meal-dsl/src/api/parser.ts"
import {MealsProvider} from "./meals.ts"

const globalCache = {
    meals: {
        loading: false,
        ready: false,
        value: [] as Recipe[],
    },
}

export function useMeals(): Recipe[]     {
    const [ready, setReady] = useState(globalCache.meals.ready)
    useEffect(() => {
        if (globalCache.meals.loading) {
            return
        }
        globalCache.meals.loading = true
        new MealsProvider().getMeals()
            .then(meals => {
                globalCache.meals.value = meals
                globalCache.meals.ready = true
                setReady(true)
            })
    }, [])
    return ready ? globalCache.meals.value : []
}