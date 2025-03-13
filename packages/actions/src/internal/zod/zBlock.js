import { validateAddress } from '../validators/validateAddress.js'

/**
 * Validates if a value is a valid block header
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateBlock = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Block must be an object' }],
		}
	}

	const errors = []

	// Required fields
	const requiredFields = ['number', 'coinbase', 'timestamp', 'difficulty', 'gasLimit']
	for (const field of requiredFields) {
		if (!(field in value)) {
			errors.push({
				path: field,
				message: `Missing required field: ${field}`,
			})
		}
	}

	// Validate bigint fields
	const bigintFields = ['number', 'timestamp', 'difficulty', 'gasLimit', 'baseFeePerGas', 'blobGasPrice']
	for (const field of bigintFields) {
		if (field in value && value[field] !== undefined) {
			if (typeof value[field] !== 'bigint') {
				errors.push({
					path: field,
					message: `${field} must be a bigint`,
				})
			} else if (value[field] < 0n) {
				errors.push({
					path: field,
					message: `${field} must be non-negative`,
				})
			}
		}
	}

	// Validate coinbase address
	if ('coinbase' in value && value.coinbase !== undefined) {
		const coinbaseValidation = validateAddress(value.coinbase)
		if (!coinbaseValidation.isValid) {
			errors.push({
				path: 'coinbase',
				message: coinbaseValidation.message || 'Invalid coinbase address',
			})
		}
	}

	// Check for unknown properties
	const validProperties = [...requiredFields, 'baseFeePerGas', 'blobGasPrice']
	for (const key in value) {
		if (!validProperties.includes(key)) {
			errors.push({
				path: key,
				message: `Unknown property in block: ${key}`,
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// For backward compatibility
export const zBlock = {
	parse: (value) => {
		const validation = validateBlock(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid block')
		}
		return value
	},
}
