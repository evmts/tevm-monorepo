import { validateAddress } from './validateAddress.js'

/**
 * Validates if a value is a valid block override set
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateBlockOverrideSet = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Block override set must be an object' }],
		}
	}

	/** @type {Array<{path: string, message: string}>} */
	const errors = []

	// Define the bigint fields that must be non-negative
	const bigintFields = ['number', 'time', 'gasLimit', 'baseFee', 'blobBaseFee']

	for (const field of bigintFields) {
		if (field in value && (/** @type {{[key: string]: any}} */ (value))[field] !== undefined) {
			const fieldValue = (/** @type {{[key: string]: any}} */ (value))[field]
			if (typeof fieldValue !== 'bigint') {
				errors.push({
					path: field,
					message: `${field} must be a bigint`,
				})
			} else if (fieldValue < 0n) {
				errors.push({
					path: field,
					message: `${field} must be non-negative`,
				})
			}
		}
	}

	// Validate coinbase if present
	if ('coinbase' in value && (/** @type {{coinbase?: unknown}} */ (value)).coinbase !== undefined) {
		const coinbaseValidation = validateAddress((/** @type {{coinbase?: unknown}} */ (value)).coinbase)
		if (!coinbaseValidation.isValid) {
			errors.push({
				path: 'coinbase',
				message: coinbaseValidation.message || 'Invalid coinbase address',
			})
		}
	}

	// Check for unknown properties
	const validProperties = [...bigintFields, 'coinbase']
	for (const key in value) {
		if (!validProperties.includes(key)) {
			errors.push({
				path: key,
				message: `Unknown property in block override set: ${key}`,
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}
