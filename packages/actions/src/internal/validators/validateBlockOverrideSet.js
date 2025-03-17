import { validateAddress } from './validateAddress.js'

/**
 * Validates if a value is a valid block override set
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @typedef {Record<string, any>} BlockOverrideSet
 */
export const validateBlockOverrideSet = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Block override set must be an object' }],
		}
	}
	
	/** @type {BlockOverrideSet} */
	const blockOverrides = value;

	const errors = []

	// Define the bigint fields that must be non-negative
	const bigintFields = ['number', 'time', 'gasLimit', 'baseFee', 'blobBaseFee']

	for (const field of bigintFields) {
		if (Object.prototype.hasOwnProperty.call(blockOverrides, field) && blockOverrides[field] !== undefined) {
			const fieldValue = blockOverrides[field]
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
	if (Object.prototype.hasOwnProperty.call(blockOverrides, 'coinbase') && blockOverrides['coinbase'] !== undefined) {
		const coinbaseValidation = validateAddress(blockOverrides['coinbase'])
		if (!coinbaseValidation.isValid) {
			errors.push({
				path: 'coinbase',
				message: coinbaseValidation.message || 'Invalid coinbase address',
			})
		}
	}

	// Check for unknown properties
	const validProperties = [...bigintFields, 'coinbase']
	for (const key in blockOverrides) {
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
