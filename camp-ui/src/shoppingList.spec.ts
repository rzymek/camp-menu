import {describe, expect, it} from "vitest"
import {recipes} from "../../meal-dsl/src/api/parser.ts"
import {shoppingList} from "./shoppingList.ts"

describe("shoppingList", () => {
    it("should ", async () => {
        const meals = await recipes(`
#meal2
* a: 42 g  
* b: 13 g
#meal1
* c: 22 L
* a: 11 g        
`)
        const plan = {
            meal1: 5,
            meal2: 3,
        } as const
        const result = shoppingList(plan, meals)

        expect(result).toEqual([
            {name: "a", unit: "g", quantity: 42 * plan.meal2 + 11 * plan.meal1},
            {name: "b", unit: "g", quantity: 13 * plan.meal2},
            {name: "c", unit: "L", quantity: 22 * plan.meal1},
        ])
    })
})