import { validateAddress } from './validateAddress.js'
import { validateHex } from './validateHex.js'

/**
 * Validates if a value is a valid state override set
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @typedef {Record<string, any>} StateOverrideSet
 */
export const validateStateOverrideSet = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'State override set must be an object' }],
		}
	}
	
	/** @type {StateOverrideSet} */
	const stateOverrides = value;

	const errors = []

	// Check each address key
	// We have to handle this differently because of TypeScript's indexing restrictions
	// First, we'll check all the keys in the object
	for (const addr in stateOverrides) {
		if (!Object.prototype.hasOwnProperty.call(stateOverrides, addr)) continue

		// Validate address key
		const addressValidation = validateAddress(addr)
		if (!addressValidation.isValid) {
			errors.push({
				path: '',
				message: `Invalid address key in state override set: ${addressValidation.message}`,
			})
			continue // Skip validating this entry if address is invalid
		}

		const entry = stateOverrides[addr]

		// Entry must be an object
		if (typeof entry !== 'object' || entry === null) {
			errors.push({
				path: addr,
				message: 'State override entry must be an object',
			})
			continue
		}

		// Validate balance if present
		if (Object.prototype.hasOwnProperty.call(entry, 'balance') && entry.balance !== undefined) {
			if (typeof entry.balance !== 'bigint') {
				errors.push({
					path: `${addr}.balance`,
					message: 'balance must be a bigint',
				})
			} else if (entry.balance < 0n) {
				errors.push({
					path: `${addr}.balance`,
					message: 'balance must be non-negative',
				})
			}
		}

		// Validate nonce if present
		if (Object.prototype.hasOwnProperty.call(entry, 'nonce') && entry.nonce !== undefined) {
			if (typeof entry.nonce !== 'bigint') {
				errors.push({
					path: `${addr}.nonce`,
					message: 'nonce must be a bigint',
				})
			} else if (entry.nonce < 0n) {
				errors.push({
					path: `${addr}.nonce`,
					message: 'nonce must be non-negative',
				})
			}
		}

		// Validate code if present
		if (Object.prototype.hasOwnProperty.call(entry, 'code') && entry.code !== undefined) {
			const codeValidation = validateHex(entry.code)
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
			if (Object.prototype.hasOwnProperty.call(entry, field) && entry[field] !== undefined) {
				const fieldValue = entry[field]

				if (typeof fieldValue !== 'object' || fieldValue === null) {
					errors.push({
						path: `${addr}.${field}`,
						message: `${field} must be an object`,
					})
					continue
				}

				// Validate each key-value pair in state/stateDiff
				for (const key in fieldValue) {
					if (!Object.prototype.hasOwnProperty.call(fieldValue, key)) continue

					const keyValidation = validateHex(key)
					if (!keyValidation.isValid) {
						errors.push({
							path: `${addr}.${field}`,
							message: `Invalid key in ${field}: ${keyValidation.message}`,
						})
					}

					const stateValue = fieldValue[key]
					const valueValidation = validateHex(stateValue)
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
