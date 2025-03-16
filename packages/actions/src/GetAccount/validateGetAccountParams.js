import { InvalidAddressError, InvalidRequestError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Validates an address
 * @param {unknown} value - Value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
const validateAddress = (value) => {
	// First check if it's a valid hex
	const hexValidation = validateHex(value)
	if (!hexValidation.isValid) {
		return hexValidation
	}

	// Then check if it's a valid address length (42 characters = 0x + 40 hex chars)
	const addressStr = /** @type {string} */ (value)
	if (addressStr.length !== 42) {
		return { isValid: false, message: 'Address must be 40 hex characters long (with 0x prefix)' }
	}

	return { isValid: true }
}

/**
 * Validates block tag parameter
 * @param {unknown} value - Value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
const validateBlockParam = (value) => {
	if (typeof value === 'string') {
		// Check for named tags
		const validNamedTags = ['latest', 'earliest', 'pending', 'safe', 'finalized']
		if (validNamedTags.includes(value)) {
			return { isValid: true }
		}

		// Check for hex block number or hash
		return validateHex(value)
	}
	if (typeof value === 'number') {
		if (value < 0) {
			return { isValid: false, message: 'Block number must be non-negative' }
		}
		return { isValid: true }
	}

	return { isValid: false, message: 'Block tag must be a string or number' }
}

/**
 * @typedef {InvalidRequestError|InvalidAddressError} ValidateGetAccountParamsError
 */

/**
 * @param {import('./GetAccountParams.js').GetAccountParams} action
 * @returns {Array<ValidateGetAccountParamsError>}
 */
export const validateGetAccountParams = (action) => {
	/**
	 * @type {Array<ValidateGetAccountParamsError>}
	 */
	const errors = []

	if (typeof action !== 'object' || action === null) {
		errors.push(new InvalidRequestError('params must be an object'))
		return errors
	}

	// Validate base params
	const baseErrors = validateBaseCallParams(action)
	if (baseErrors.length > 0) {
		baseErrors.forEach((error) => {
			errors.push(new InvalidRequestError(error.message))
		})
	}

	// Validate address (required)
	if (!('address' in action) || action.address === undefined) {
		errors.push(new InvalidAddressError('address is required'))
	} else {
		const addressValidation = validateAddress(action.address)
		if (!addressValidation.isValid) {
			errors.push(new InvalidAddressError(`Invalid address param. ${addressValidation.message}`))
		}
	}

	// Validate returnStorage if present
	if ('returnStorage' in action && action.returnStorage !== undefined) {
		if (typeof action.returnStorage !== 'boolean') {
			errors.push(
				new InvalidRequestError('Invalid returnStorage param. returnStorage must be a boolean or not provided.'),
			)
		}
	}

	// Validate blockTag if present
	if ('blockTag' in action && action.blockTag !== undefined) {
		const blockTagValidation = validateBlockParam(action.blockTag)
		if (!blockTagValidation.isValid) {
			errors.push(new InvalidRequestError(`Invalid blockTag param. ${blockTagValidation.message}`))
		}
	}

	return errors
}
