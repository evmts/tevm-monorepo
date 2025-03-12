/**
 * Regex for validating hex strings
 */
export const hexRegex = /^0x[0-9a-fA-F]*$/

/**
 * Validates if the input is a valid hex string
 * @param {unknown} value - The value to validate
 * @returns {boolean} True if the value is a valid hex string
 */
export const isValidHex = (value) => {
	if (typeof value !== 'string') return false
	return hexRegex.test(value)
}

/**
 * Validates a hex string and returns it or throws if invalid
 * @param {unknown} value - The value to validate
 * @param {string} [errorMessage='Invalid hexadecimal string'] - Custom error message
 * @returns {import('@tevm/utils').Hex} The validated hex string
 * @throws {Error} If the value is not a valid hex string
 */
export const validateHex = (value, errorMessage = 'Invalid hexadecimal string') => {
	if (!isValidHex(value)) {
		throw new Error(errorMessage)
	}
	return /** @type {import('@tevm/utils').Hex} */ (value)
}
