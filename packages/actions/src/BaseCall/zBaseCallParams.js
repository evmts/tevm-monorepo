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
export const zBaseCallParams = {
	parse: (value) => {
		const errors = validateBaseCallParams(value)
		if (errors.length > 0) {
			throw errors[0]
		}
		return value
	},
	safeParse: (value) => {
		const errors = validateBaseCallParams(value)
		if (errors.length === 0) {
			return { success: true, data: value }
		} else {
			return {
				success: false,
				error: {
					format: () => {
						// Format errors into a structure similar to Zod errors
						const formatted = { _errors: [] }
						
						errors.forEach(err => {
							// Add to top-level errors
							formatted._errors.push(err.message)
							
							// Extract field from error name
							const errorType = err.name.replace('Invalid', '').replace('Error', '').toLowerCase()
							if (errorType && errorType !== 'params') {
								if (!formatted[errorType]) {
									formatted[errorType] = { _errors: [] }
								}
								formatted[errorType]._errors.push(err.message)
							}
						})
						
						return formatted
					}
				}
			}
		}
	}
}
