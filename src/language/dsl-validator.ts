import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { DslAstType, Person } from './generated/ast.js';
import type { DslServices } from './dsl-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DslServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DslValidator;
    const checks: ValidationChecks<DslAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DslValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
