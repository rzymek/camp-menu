import {describe, expect, it} from "vitest"
import {createParser} from "../../camp-dsl/src"
import {mealList} from "./mealList.ts"

describe("mealList", () => {
    it("should ", async () => {
        const planParser = createParser()
        const plan = await planParser(`
thu:
    meal1 (2), meal2    (1)
fri (3):
    meal1, meal2(2)        
`)
        const list = await mealList(plan)
        expect(list).toEqual({
            meal1: 2 + 3,
            meal2: 1 + 2,
        })
    })
})