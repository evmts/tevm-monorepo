import { validateAddress } from './validateAddress.js'
import { validateHex } from './validateHex.js'

/**
 * @typedef {Object} StateOverrideEntry
 * @property {bigint} [balance]
 * @property {bigint} [nonce]
 * @property {string} [code]
 * @property {Object<string, string>} [state]
 * @property {Object<string, string>} [stateDiff]
 */

/**
 * Validates if a value is a valid state override set
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateStateOverrideSet = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'State override set must be an object' }],
		}
	}

	/** @type {Array<{path: string, message: string}>} */
	const errors = []

	// Check each address key
	for (const addr in value) {
		// Validate address key
		const addressValidation = validateAddress(addr)
		if (!addressValidation.isValid) {
			errors.push({
				path: '',
				message: `Invalid address key in state override set: ${addressValidation.message}`,
			})
			continue // Skip validating this entry if address is invalid
		}

		const entry = /** @type {Record<string, unknown>} */ (value)[addr]

		// Entry must be an object
		if (typeof entry !== 'object' || entry === null) {
			errors.push({
				path: addr,
				message: 'State override entry must be an object',
			})
			continue
		}

		// Cast entry to expected type for validation
		const typedEntry = /** @type {Record<string, unknown>} */ (entry)

		// Validate balance if present
		if ('balance' in typedEntry && typedEntry['balance'] !== undefined) {
			if (typeof typedEntry['balance'] !== 'bigint') {
				errors.push({
					path: `${addr}.balance`,
					message: 'balance must be a bigint',
				})
			} else if (typedEntry['balance'] < 0n) {
				errors.push({
					path: `${addr}.balance`,
					message: 'balance must be non-negative',
				})
			}
		}

		// Validate nonce if present
		if ('nonce' in typedEntry && typedEntry['nonce'] !== undefined) {
			if (typeof typedEntry['nonce'] !== 'bigint') {
				errors.push({
					path: `${addr}.nonce`,
					message: 'nonce must be a bigint',
				})
			} else if (typedEntry['nonce'] < 0n) {
				errors.push({
					path: `${addr}.nonce`,
					message: 'nonce must be non-negative',
				})
			}
		}

		// Validate code if present
		if ('code' in typedEntry && typedEntry['code'] !== undefined) {
			const codeValidation = validateHex(typedEntry['code'])
			if (!codeValidation.isValid) {
				errors.push({
					path: `${addr}.code`,
					message: codeValidation.message || 'Invalid code',
				})
			}
		}

		// Validate state and stateDiff if present
		const stateFields = ['state', 'stateDiff']
		for (const field of stateFields) {
			if (field in typedEntry && typedEntry[field] !== undefined) {
				if (typeof typedEntry[field] !== 'object' || typedEntry[field] === null) {
					errors.push({
						path: `${addr}.${field}`,
						message: `${field} must be an object`,
					})
					continue
				}

				// Validate each key-value pair in state/stateDiff
				const stateObj = /** @type {Record<string, unknown>} */ (typedEntry[field])
				for (const key in stateObj) {
					const keyValidation = validateHex(key)
					if (!keyValidation.isValid) {
						errors.push({
							path: `${addr}.${field}`,
							message: `Invalid key in ${field}: ${keyValidation.message}`,
						})
					}

					const valueValidation = validateHex(stateObj[key])
					if (!valueValidation.isValid) {
						errors.push({
							path: `${addr}.${field}.${key}`,
							message: `Invalid value in ${field}: ${valueValidation.message}`,
						})
					}
				}
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}
