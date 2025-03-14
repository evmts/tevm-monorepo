import { validateBaseParams } from '../BaseCall/validateBaseParams.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateBlockParam } from '../internal/validators/validateBlockParam.js'

/**
 * Validates if a value contains valid get account parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @internal
 */
const validateGetAccountParamsInternal = (value) => {
	// First validate it as base params
	const baseValidation = validateBaseParams(value)
	if (!baseValidation.isValid) {
		return baseValidation
	}

	const errors = [...baseValidation.errors]

	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Parameters must be an object' }],
		}
	}

	// Validate required address field
	if (!('address' in value) || value.address === undefined) {
		errors.push({
			path: 'address',
			message: 'Missing required field: address',
		})
	} else {
		const addressValidation = validateAddress(value.address)
		if (!addressValidation.isValid) {
			errors.push({
				path: 'address',
				message: addressValidation.message || 'Invalid address',
			})
		}
	}

	// Validate blockTag if present
	if ('blockTag' in value && value.blockTag !== undefined) {
		const blockTagValidation = validateBlockParam(value.blockTag)
		if (!blockTagValidation.isValid) {
			errors.push({
				path: 'blockTag',
				message: blockTagValidation.message || 'Invalid block tag',
			})
		}
	}

	// Validate returnStorage if present
	if ('returnStorage' in value && value.returnStorage !== undefined) {
		if (typeof value.returnStorage !== 'boolean') {
			errors.push({
				path: 'returnStorage',
				message: 'returnStorage must be a boolean',
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zGetAccountParams = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateGetAccountParamsInternal(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid get account parameters')
		}
		return value
	},
}
