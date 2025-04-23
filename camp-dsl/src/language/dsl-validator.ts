import type {  ValidationChecks } from 'langium';
import type { DslAstType} from './generated/ast.js';
import type { DslServices } from './dsl-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DslServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DslValidator;
    const checks: ValidationChecks<DslAstType> = {
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DslValidator {


}
