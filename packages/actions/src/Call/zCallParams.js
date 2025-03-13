import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Validates call parameters using the zod schema
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateCallParamsZod = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'params must be an object' }],
		}
	}

	const errors = []
	const paramsObj = /** @type {Record<string, unknown>} */ (params)

	// Validate base call params first
	const baseErrors = validateBaseCallParams(params)
	if (baseErrors && baseErrors.length > 0) {
		// Transform BaseCallParams errors to our format
		for (const error of baseErrors) {
			errors.push({
				path: error.name || '',
				message: error.message || 'Invalid parameter',
			})
		}
	}

	// Validate hex fields
	const hexFields = ['data', 'salt', 'code', 'deployedBytecode']
	for (const field of hexFields) {
		if (field in paramsObj && paramsObj[field] !== undefined) {
			const hexValidation = validateHex(paramsObj[field])
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
		'code' in paramsObj &&
		paramsObj.code !== undefined &&
		'deployedBytecode' in paramsObj &&
		paramsObj.deployedBytecode !== undefined
	) {
		errors.push({
			path: '',
			message: 'Cannot have both code and deployedBytecode set',
		})
	}

	// Cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if ('createTransaction' in paramsObj && paramsObj.createTransaction === true) {
		if ('stateOverrideSet' in paramsObj && paramsObj.stateOverrideSet !== undefined) {
			errors.push({
				path: 'stateOverrideSet',
				message: 'Cannot have stateOverrideSet for createTransaction',
			})
		}

		if ('blockOverrideSet' in paramsObj && paramsObj.blockOverrideSet !== undefined) {
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
