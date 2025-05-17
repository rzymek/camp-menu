import type {ValidationAcceptor, ValidationChecks} from "langium"
import {DslAstType, Recipe} from "./generated/ast.js"
import type {DslServices} from "./dsl-module.js"

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DslServices) {
    const registry = services.validation.ValidationRegistry
    const validator = services.validation.DslValidator
    const checks: ValidationChecks<DslAstType> = {
        Recipe: validator.checkRecipe,
    }
    registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class DslValidator {
    private validMealNames: string[] = []

    checkRecipe(meal: Recipe, accept: ValidationAcceptor): void {
        this.checkRecipeCount(meal, accept);
        this.checkRecipeName(meal, accept);
    }

    checkRecipeCount(meal: Recipe, accept: ValidationAcceptor): void {
        if (meal.count === undefined && meal.$container.$container.count === undefined) {
            accept("error", `Brak liczby osób. Usupełnij przy posiłku lub ustaw dla dnia.`, {node: meal})
        }
    }

    checkRecipeName(meal: Recipe, accept: ValidationAcceptor): void {
        if (this.validMealNames.length === 0) {
            return
        }
        if (!this.validMealNames.includes(meal.name)) {
            accept("error", `Nieznany przepis ${meal.name}`, {node: meal})
        }
    }

    public update(mealNames: string[]): void {
        this.validMealNames = mealNames
    }
}