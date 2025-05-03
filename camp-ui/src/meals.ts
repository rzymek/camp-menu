import {recipes} from "../../meal-dsl/src/api/parser.ts"

export const meals = await loadMeals();

async function loadMeals() {
    const mealsSrc = await fetch("/meals.md").then(r => r.text());
    return await recipes(mealsSrc);
}
