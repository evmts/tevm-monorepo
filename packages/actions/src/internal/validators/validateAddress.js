import { validateHex } from './validateHex.js'

/**
 * Validates if a value is a valid Ethereum address
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateAddress = (value) => {
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
