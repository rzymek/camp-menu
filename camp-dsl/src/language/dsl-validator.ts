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
        Recipe: validator.checkRecipeName,
    }
    registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class DslValidator {
    private validMealNames: string[] = []

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