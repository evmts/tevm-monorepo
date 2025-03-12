import { isAddress } from '@tevm/utils'

/**
 * Validates if the input is a valid ethereum address
 * @param {unknown} value - The value to validate
 * @returns {boolean} True if the value is a valid ethereum address
 */
export const isValidAddress = (value) => {
	if (typeof value !== 'string') return false
	return isAddress(value)
}

/**
 * Validates an ethereum address and returns it or throws if invalid
 * @param {unknown} value - The value to validate
 * @param {string} [errorMessage='Invalid Ethereum address'] - Custom error message
 * @returns {string} The validated ethereum address
 * @throws {Error} If the value is not a valid ethereum address
 */
export const validateAddress = (value, errorMessage = 'Invalid Ethereum address') => {
	if (!isValidAddress(value)) {
		throw new Error(errorMessage)
	}
	return value
}
