import {Recipe, recipes} from "../../meal-dsl/src/api/parser.ts"

export class MealsProvider {
    private meals?:Recipe[];

    public async getMeals() {
        if(this.meals === undefined) {
            const mealsSrc = await fetch("meals.md").then(r => r.text());
            this.meals = await recipes(mealsSrc);
        }
        return this.meals;
    }
}
