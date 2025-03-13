import { validateBaseParams } from '../BaseCall/validateBaseParams.js'
import { validateHex } from '../internal/validators/validateHex.js'

/**
 * Validates account storage for load state
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
const validateAccountStorage = (value, path = '') => {
	const errors = []

	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path, message: 'Account storage must be an object' }],
		}
	}

	// Validate required fields
	const requiredFields = ['nonce', 'balance', 'storageRoot', 'codeHash']
	for (const field of requiredFields) {
		if (!(field in value)) {
			errors.push({
				path: path ? `${path}.${field}` : field,
				message: `Missing required field: ${field}`,
			})
		}
	}

	// Validate nonce and balance
	if ('nonce' in value) {
		if (typeof value.nonce !== 'bigint') {
			errors.push({
				path: path ? `${path}.nonce` : 'nonce',
				message: 'nonce must be a bigint',
			})
		}
	}

	if ('balance' in value) {
		if (typeof value.balance !== 'bigint') {
			errors.push({
				path: path ? `${path}.balance` : 'balance',
				message: 'balance must be a bigint',
			})
		}
	}

	// Validate hex fields
	if ('storageRoot' in value) {
		const validation = validateHex(value.storageRoot)
		if (!validation.isValid) {
			errors.push({
				path: path ? `${path}.storageRoot` : 'storageRoot',
				message: validation.message || 'Invalid storage root',
			})
		}
	}

	if ('codeHash' in value) {
		const validation = validateHex(value.codeHash)
		if (!validation.isValid) {
			errors.push({
				path: path ? `${path}.codeHash` : 'codeHash',
				message: validation.message || 'Invalid code hash',
			})
		}
	}

	// Validate storage if present
	if ('storage' in value && value.storage !== undefined) {
		if (typeof value.storage !== 'object' || value.storage === null) {
			errors.push({
				path: path ? `${path}.storage` : 'storage',
				message: 'storage must be an object',
			})
		} else {
			// Check that all keys and values are valid hex
			for (const key in value.storage) {
				const keyValidation = validateHex(key)
				if (!keyValidation.isValid) {
					errors.push({
						path: path ? `${path}.storage.key` : 'storage.key',
						message: `Invalid storage key: ${keyValidation.message}`,
					})
				}

				const valueValidation = validateHex(value.storage[key])
				if (!valueValidation.isValid) {
					errors.push({
						path: path ? `${path}.storage.value` : 'storage.value',
						message: `Invalid storage value: ${valueValidation.message}`,
					})
				}
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// For backward compatibility
export const zAccountStorage = {
	parse: (value) => {
		const validation = validateAccountStorage(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid account storage')
		}
		return value
	},
}

/**
 * Validates if a value contains valid load state parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateLoadStateParams = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Parameters must be an object' }],
		}
	}

	const errors = []

	// Validate state field
	if (!('state' in value) || value.state === undefined) {
		errors.push({
			path: 'state',
			message: 'Missing required field: state',
		})
	} else if (typeof value.state !== 'object' || value.state === null) {
		errors.push({
			path: 'state',
			message: 'state must be an object mapping addresses to account storage',
		})
	} else {
		// Validate each account in the state
		for (const address in value.state) {
			const accountValidation = validateAccountStorage(value.state[address], `state.${address}`)
			errors.push(...accountValidation.errors)
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// For backward compatibility
export const zLoadStateParams = {
	parse: (value) => {
		const validation = validateLoadStateParams(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid load state parameters')
		}
		return value
	},
	safeParse: (value) => {
		const validation = validateLoadStateParams(value)
		if (validation.isValid) {
			return { success: true, data: value }
		} else {
			return {
				success: false,
				error: {
					format: () => {
						const formatted = { _errors: [] }
						validation.errors.forEach(err => {
							if (err.path.startsWith('state.')) {
								const pathParts = err.path.split('.')
								if (pathParts.length > 1) {
									if (!formatted.state) {
										formatted.state = { _errors: [] }
									}
									formatted.state._errors.push(err.message)
								}
							} else {
								formatted._errors.push(err.message)
							}
						})
						return formatted
					}
				}
			}
		}
	}
}
