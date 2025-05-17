import {Meals, recipes} from "../../meal-dsl/src/api/parser.ts"
import mealsSrc from "./meals.md?raw";

export class MealsProvider {
    private meals?:Meals;

    public async getMeals() {
        await this.lazyLoad()
        return this.meals?.recipes ?? [];
    }

    public async getRecipesAndCategories() {
        await this.lazyLoad()
        return this.meals;
    }

    private async lazyLoad(): Promise<void> {
        if (this.meals === undefined) {
            this.meals = await recipes(mealsSrc)
        }
    }
}
