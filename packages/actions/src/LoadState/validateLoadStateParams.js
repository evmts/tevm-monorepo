import { InvalidRequestError } from '@tevm/errors'
import { validateHex } from '../internal/validators/validateHex.js'

/**
 * Type for errors returned by validateLoadStateParams.
 * @typedef {InvalidRequestError} ValidateLoadStateParamsError
 */

/**
 * Validates account storage for load state
 * @param {unknown} value - The value to validate
 * @param {string} [path=''] - The path to the value
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
const validateAccountStorage = (value, path = '') => {
	/** @type {Array<{path: string, message: string}>} */
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
			// Check that all values are valid hex (but not the keys, which can be non-hex)
			// When using JSON.stringify and Maps, numeric keys remain as strings without 0x prefix
			const storage = /** @type {Record<string, unknown>} */ (value.storage)
			for (const key in storage) {
				const valueValidation = validateHex(storage[key])
				if (!valueValidation.isValid) {
					errors.push({
						path: path ? `${path}.storage['${key}']` : `storage['${key}']`,
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

/**
 * Validates the raw load state parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
const validateLoadStateParamsRaw = (value) => {
	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Parameters must be an object' }],
		}
	}

	/** @type {Array<{path: string, message: string}>} */
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
		const state = /** @type {Record<string, unknown>} */ (value.state)
		for (const address in state) {
			const accountValidation = validateAccountStorage(state[address], `state.${address}`)
			errors.push(...accountValidation.errors)
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validates the parameters for loading the state into the VM.
 *
 * @param {import('./LoadStateParams.js').LoadStateParams} action - The parameters for the load state action.
 * @returns {Array<ValidateLoadStateParamsError>} - An array of errors, if any.
 *
 * @example
 * ```typescript
 * import { validateLoadStateParams } from 'tevm/actions'
 *
 * const params = { state: {...}  }
 * const errors = validateLoadStateParams(params)
 * if (errors.length > 0) {
 *   console.error('Validation errors:', errors)
 * }
 * ```
 */
export const validateLoadStateParams = (action) => {
	/**
	 * @type {Array<ValidateLoadStateParamsError>}
	 */
	const errors = []

	const validation = validateLoadStateParamsRaw(action)

	if (!validation.isValid) {
		validation.errors.forEach((error) => {
			const errorMessage = error.message || 'Invalid parameter'
			errors.push(new InvalidRequestError(error.path ? `${error.path}: ${errorMessage}` : errorMessage))
		})
	}

	return errors
}
