import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Validates call parameters - internal implementation used by zCallParams
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @internal
 */
const validateCallParamsInternal = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'params must be an object' }],
		}
	}

	const errors = []

	// Validate base call params first
	const baseValidation = validateBaseCallParams(params)
	if (baseValidation.errors && baseValidation.errors.length > 0) {
		errors.push(...baseValidation.errors)
	}

	// Validate hex fields
	const hexFields = ['data', 'salt', 'code', 'deployedBytecode']
	for (const field of hexFields) {
		if (field in params && params[field] !== undefined) {
			const hexValidation = validateHex(params[field])
			if (!hexValidation.isValid) {
				errors.push({
					path: field,
					message: hexValidation.message || `Invalid ${field} value`,
				})
			}
		}
	}

	// Cannot have both code and deployedBytecode
	if (
		'code' in params &&
		params.code !== undefined &&
		'deployedBytecode' in params &&
		params.deployedBytecode !== undefined
	) {
		errors.push({
			path: '',
			message: 'Cannot have both code and deployedBytecode set',
		})
	}

	// Cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if ('createTransaction' in params && params.createTransaction === true) {
		if ('stateOverrideSet' in params && params.stateOverrideSet !== undefined) {
			errors.push({
				path: 'stateOverrideSet',
				message: 'Cannot have stateOverrideSet for createTransaction',
			})
		}

		if ('blockOverrideSet' in params && params.blockOverrideSet !== undefined) {
			errors.push({
				path: 'blockOverrideSet',
				message: 'Cannot have blockOverrideSet for createTransaction',
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// For backward compatibility
export const zCallParams = {
	parse: (params) => {
		const validation = validateCallParamsInternal(params)
		if (!validation.isValid) {
			// Format the error message based on specific conditions
			if (params && 'code' in params && 'deployedBytecode' in params) {
				throw new Error('Cannot have both code and deployedBytecode set')
			}
			if (params && params.createTransaction === true) {
				if ('stateOverrideSet' in params || 'blockOverrideSet' in params) {
					throw new Error('Cannot have stateOverrideSet or blockOverrideSet for createTransaction')
				}
			}
			// Default error
			throw new Error(validation.errors[0]?.message || 'Invalid call parameters')
		}
		return params
	},
	safeParse: (params) => {
		const validation = validateCallParamsInternal(params)
		if (validation.isValid) {
			return { success: true, data: params }
		}
		return {
			success: false,
			error: {
				format: () => {
					// Format errors into a structure similar to Zod errors
					const formatted = { _errors: [] }

					validation.errors.forEach((err) => {
						// Add to top-level errors
						formatted._errors.push(err.message)

						// Add to specific field errors
						if (err.path) {
							if (!formatted[err.path]) {
								formatted[err.path] = { _errors: [] }
							}
							formatted[err.path]._errors.push(err.message)
						}
					})

					return formatted
				},
			},
		}
	},
}
