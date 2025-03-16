import { validateAddress } from '../validators/validateAddress.js'

/**
 * @typedef {Object} BlockHeader
 * @property {bigint} number
 * @property {string} coinbase
 * @property {bigint} timestamp
 * @property {bigint} difficulty
 * @property {bigint} gasLimit
 * @property {bigint} [baseFeePerGas]
 * @property {bigint} [blobGasPrice]
 */

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

	/** @type {Array<{path: string, message: string}>} */
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
		if (field in value) {
			// Create a type-safe access to value with an index signature
			const typedValue = /** @type {Record<string, unknown>} */ (value)
			if (typedValue[field] !== undefined) {
				if (typeof typedValue[field] !== 'bigint') {
					errors.push({
						path: field,
						message: `${field} must be a bigint`,
					})
				} else if (/** @type {bigint} */ (typedValue[field]) < 0n) {
					errors.push({
						path: field,
						message: `${field} must be non-negative`,
					})
				}
			}
		}
	}

	// Validate coinbase address
	if ('coinbase' in value && /** @type {Record<string, unknown>} */ (value)['coinbase'] !== undefined) {
		const coinbaseValidation = validateAddress(/** @type {Record<string, unknown>} */ (value)['coinbase'])
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

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zBlock = {
	/**
	 * Parse and validate a block
	 * @param {unknown} value - The value to parse
	 * @returns {any} - The parsed block
	 */
	parse: (value) => {
		const validation = validateBlock(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid block')
		}
		return value
	},
}
