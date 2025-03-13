import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * Validates if a value is a valid base call parameters object
 * @param {import('./BaseCallParams.js').BaseCallParams} value - The value to validate
 * @returns {{ isValid: boolean, errors?: Array<import('@tevm/errors').BaseError> }} - Validation result with any errors
 */
export const validateBaseCallParamsObject = (value) => {
	const errors = validateBaseCallParams(value)
	return {
		isValid: errors.length === 0,
		errors: errors.length > 0 ? errors : undefined,
	}
}

// For backward compatibility
export { validateBaseCallParamsObject as zBaseCallParams }
