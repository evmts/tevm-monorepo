import { validateBaseParams } from '../BaseCall/validateBaseParams.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateBytecode } from '../internal/validators/validateBytecode.js'
import { validateHex } from '../internal/validators/validateHex.js'
import { validateStorageRoot } from '../internal/validators/validateStorageRoot.js'

/**
 * Validates if a value contains valid set account parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateSetAccountParams = (value) => {
	// First validate it as base params
	const baseValidation = validateBaseParams(value)
	if (!baseValidation.isValid) {
		return baseValidation
	}

	const errors = [...baseValidation.errors]

	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Parameters must be an object' }],
		}
	}

	// Validate required address field
	if (!('address' in value) || value.address === undefined) {
		errors.push({
			path: 'address',
			message: 'Missing required field: address',
		})
	} else {
		const addressValidation = validateAddress(value.address)
		if (!addressValidation.isValid) {
			errors.push({
				path: 'address',
				message: addressValidation.message || 'Invalid address',
			})
		}
	}

	// Validate numeric fields
	if ('balance' in value && value.balance !== undefined) {
		if (typeof value.balance !== 'bigint') {
			errors.push({
				path: 'balance',
				message: 'balance must be a bigint',
			})
		} else if (value.balance < 0n) {
			errors.push({
				path: 'balance',
				message: 'balance must be non-negative',
			})
		}
	}

	if ('nonce' in value && value.nonce !== undefined) {
		if (typeof value.nonce !== 'bigint') {
			errors.push({
				path: 'nonce',
				message: 'nonce must be a bigint',
			})
		} else if (value.nonce < 0n) {
			errors.push({
				path: 'nonce',
				message: 'nonce must be non-negative',
			})
		}
	}

	// Validate bytecode
	if ('deployedBytecode' in value && value.deployedBytecode !== undefined) {
		const bytecodeValidation = validateBytecode(value.deployedBytecode)
		if (!bytecodeValidation.isValid) {
			errors.push({
				path: 'deployedBytecode',
				message: bytecodeValidation.message || 'Invalid bytecode',
			})
		}
	}

	// Validate storage root
	if ('storageRoot' in value && value.storageRoot !== undefined) {
		const storageRootValidation = validateStorageRoot(value.storageRoot)
		if (!storageRootValidation.isValid) {
			errors.push({
				path: 'storageRoot',
				message: storageRootValidation.message || 'Invalid storage root',
			})
		}
	}

	// Validate state and stateDiff
	const validateStateRecord = (field, fieldValue) => {
		if (typeof fieldValue !== 'object' || fieldValue === null) {
			errors.push({
				path: field,
				message: `${field} must be an object mapping hex keys to hex values`,
			})
			return
		}

		for (const key in fieldValue) {
			const keyValidation = validateHex(key)
			if (!keyValidation.isValid) {
				errors.push({
					path: `${field}.key`,
					message: `Invalid key in ${field}: ${keyValidation.message}`,
				})
			}

			const valueValidation = validateHex(fieldValue[key])
			if (!valueValidation.isValid) {
				errors.push({
					path: `${field}.value`,
					message: `Invalid value in ${field}: ${valueValidation.message}`,
				})
			}
		}
	}

	if ('state' in value && value.state !== undefined) {
		validateStateRecord('state', value.state)
	}

	if ('stateDiff' in value && value.stateDiff !== undefined) {
		validateStateRecord('stateDiff', value.stateDiff)
	}

	// Cannot have both state and stateDiff
	if (value.state && value.stateDiff) {
		errors.push({
			path: '',
			message: 'Cannot have both state and stateDiff',
		})
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// For backward compatibility
export const zSetAccountParams = {
	parse: (value) => {
		const validation = validateSetAccountParams(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid set account parameters')
		}
		return value
	},
}
