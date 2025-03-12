import { isValidHex } from './zHex.js'

const VALID_BLOCK_TAGS = ['latest', 'earliest', 'pending', 'safe', 'finalized']

/**
 * Validates if the input is a valid block parameter
 * @param {unknown} value - The value to validate
 * @returns {boolean} True if the value is a valid block parameter
 */
export const isValidBlockParam = (value) => {
	if (typeof value === 'string') {
		if (VALID_BLOCK_TAGS.includes(value)) return true
		return isValidHex(value)
	}

	if (typeof value === 'bigint') return true

	return false
}

/**
 * Validates a block parameter and returns it or throws if invalid
 * @param {unknown} value - The value to validate
 * @param {string} [errorMessage='Invalid block parameter'] - Custom error message
 * @returns {string | bigint} The validated block parameter
 * @throws {Error} If the value is not a valid block parameter
 */
export const validateBlockParam = (value, errorMessage = 'Invalid block parameter') => {
	if (!isValidBlockParam(value)) {
		throw new Error(errorMessage)
	}
	return value
}
