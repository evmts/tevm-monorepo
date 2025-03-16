export const hexRegex = /^0x[0-9a-fA-F]*$/

/**
 * Validates if a value is a valid hex string
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateHex = (value) => {
	if (typeof value !== 'string') {
		return { isValid: false, message: 'value must be a string' }
	}

	if (!hexRegex.test(value)) {
		return { isValid: false, message: 'value must be a hex string' }
	}

	return { isValid: true }
}

/**
 * Transform a validated hex string to the proper type
 * @param {string} value - The validated hex string
 * @returns {import('@tevm/utils').Hex} - The typed hex string
 */
export const transformHex = (value) => {
	return /** @type {import('@tevm/utils').Hex}*/ (value)
}
