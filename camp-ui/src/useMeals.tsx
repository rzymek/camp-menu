import {useEffect, useState} from "preact/compat"
import {Recipe} from "../../meal-dsl/src/api/parser.ts"
import {MealsProvider} from "./meals.ts"

export function useMeals() {
    const [meals, setMeals] = useState<Recipe[]>([])
    useEffect(() => {
        new MealsProvider().getMeals().then(setMeals)
    }, [])
    return meals
}