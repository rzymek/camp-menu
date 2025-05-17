import {describe, expect, it} from "vitest"
import {MealsProvider} from "./meals.ts"
import {keys, unique} from "remeda"

describe("MealsProvider", () => {

    it("should load and parse meals correctly", async () => {
        // given
        const mealsProvider = new MealsProvider()
        // when
        const recipes = (await mealsProvider.getRecipesAndCategories())!
        // then
        expect(unique(recipes.categories.map(it => typeof it)!)).toEqual(["string"])
        expect(unique(recipes.recipes.map(it => keys(it).sort().join()))).toEqual(["equipment,items,title"])
        expect(unique(recipes.recipes.flatMap(it =>
            it.items.map(i => keys(i).sort().join())
        )!)).toEqual(["category,name,quantity,unit"])
    })

})