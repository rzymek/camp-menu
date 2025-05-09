import type {ValidationAcceptor, ValidationChecks} from "langium"
import type {DslAstType, Model} from "./generated/ast.js"
import type {DslServices} from "./dsl-module.js"
import {filter, flatMap, forEach, groupBy, map, pipe, values} from "remeda"

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DslServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DslValidator;
    const checks: ValidationChecks<DslAstType> = {
        Model: validator.check
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DslValidator {
    private checkMissingCategory(model: Model, accept: ValidationAcceptor): void {
        const itemsWithCategory = new Set(model.categories.flatMap(category => category.items).map(item => item.name.trim()));
        model.recipies.forEach(recipe => {
            recipe.items.forEach(item => {
                if(!itemsWithCategory.has(item.name.trim())) {
                    accept('warning', `Brak kategorii dla ${item.name}`, {
                        node: item
                    });
                }
            })
        })
    }
    private checkInconsistentUnit(model: Model, accept: ValidationAcceptor) {
        pipe(
            model.recipies,
            flatMap(recipe => recipe.items),
            groupBy(item => item.name),
            values(),
            map(items => ({
                items,
                unitsUsed: new Set(items.map(i => i.quantity.unit))
            })),
            filter(value  => value.unitsUsed.size > 1),
            forEach(value => {
                value.items.forEach(item => {
                    accept('error', `Niespójne jednostki ${[...value.unitsUsed].join(", ")}`, {
                        node: item
                    });
                });
            })
        )
    }
    private checkUnusedCategoryItems(model: Model, accept: ValidationAcceptor) {
        const usedItems = new Set(model.recipies.flatMap(recipe => recipe.items).map(item => item.name.trim()));
        model.categories.forEach(category => {
            category.items.forEach(item => {
                if(!usedItems.has(item.name.trim())) {
                    accept('warning', `Nie użyty składnik ${item.name}`, {
                        node: item
                    });
                }
            })
        })
    }
    private checkDuplicateCategory(model: Model, accept: ValidationAcceptor) {
        const uniqCategories = new Set<string>();
        model.categories.forEach(category => {
            if (uniqCategories.has(category.category)) {
                accept('error', `Duplikat kategorii ${category.category}`, {
                    node: category
                });
            }
            uniqCategories.add(category.category);
        })
    }

    private checkDuplicateCategoryItems(model: Model, accept: ValidationAcceptor) {
        const uniqCategoriesItems = new Set<string>();
        model.categories.forEach(category => {
            category.items.forEach(item => {
                if(uniqCategoriesItems.has(item.name.trim())){
                    accept('error', `Duplikat ${item.name}`, {
                        node: item
                    });
                }
                uniqCategoriesItems.add(item.name.trim());
            })
        })

    }
    check(model: Model, accept: ValidationAcceptor): void {
        this.checkMissingCategory(model, accept);
        this.checkInconsistentUnit(model, accept);
        this.checkUnusedCategoryItems(model, accept);
        this.checkDuplicateCategoryItems(model, accept);
        this.checkDuplicateCategory(model, accept);
    }
}