import {
	InvalidBlobVersionedHashesError,
	InvalidBlockError,
	InvalidCallerError,
	InvalidDepthError,
	InvalidGasPriceError,
	InvalidGasRefundError,
	InvalidOriginError,
	InvalidParamsError,
	InvalidSkipBalanceError,
} from '@tevm/errors'
import {
	InvalidMaxFeePerGasError,
	InvalidMaxPriorityFeePerGasError,
	InvalidSelfdestructError,
	InvalidToError,
	InvalidValueError,
} from '@tevm/errors'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * @typedef {InvalidParamsError| InvalidSkipBalanceError| InvalidGasRefundError| InvalidBlockError| InvalidGasPriceError| InvalidOriginError| InvalidCallerError| InvalidDepthError| InvalidBlobVersionedHashesError| InvalidMaxFeePerGasError| InvalidMaxPriorityFeePerGasError| InvalidSelfdestructError| InvalidToError| InvalidValueError} ValidateBaseCallParamsError
 */

/**
 * Validates an address
 * @param {unknown} value - Value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
const validateAddress = (value) => {
	// First check if it's a valid hex
	const hexValidation = validateHex(value)
	if (!hexValidation.isValid) {
		return hexValidation
	}

	// Then check if it's a valid address length (42 characters = 0x + 40 hex chars)
	const addressStr = /** @type {string} */ (value)
	if (addressStr.length !== 42) {
		return { isValid: false, message: 'Address must be 40 hex characters long (with 0x prefix)' }
	}

	return { isValid: true }
}

/**
 * Validates block tag parameter
 * @param {unknown} value - Value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
const validateBlockTag = (value) => {
	if (typeof value === 'string') {
		// Check for named tags
		const validNamedTags = ['latest', 'earliest', 'pending', 'safe', 'finalized']
		if (validNamedTags.includes(value)) {
			return { isValid: true }
		}

		// Check for hex block number or hash
		return validateHex(value)
	}
	if (typeof value === 'number') {
		if (value < 0) {
			return { isValid: false, message: 'Block number must be non-negative' }
		}
		return { isValid: true }
	}

	return { isValid: false, message: 'Block tag must be a string or number' }
}

/**
 * Validates a state override entry
 * @param {unknown} entry - The state override entry to validate
 * @param {string} address - The address this entry is for (used in error messages)
 * @returns {Array<{message: string}>} - Array of error messages
 */
const validateStateOverrideEntry = (entry, address) => {
	const errors = []

	if (typeof entry !== 'object' || entry === null) {
		errors.push({ message: `State override entry for ${address} must be an object` })
		return errors
	}

	// Validate balance if present
	if ('balance' in entry && entry.balance !== undefined) {
		if (typeof entry.balance !== 'bigint' && typeof entry.balance !== 'string') {
			errors.push({ message: `balance for ${address} must be a bigint or hex string` })
		} else if (typeof entry.balance === 'bigint' && entry.balance < 0n) {
			errors.push({ message: `balance for ${address} must be non-negative` })
		} else if (typeof entry.balance === 'string') {
			const hexValidation = validateHex(entry.balance)
			if (!hexValidation.isValid) {
				errors.push({ message: `balance for ${address}: ${hexValidation.message}` })
			}
		}
	}

	// Validate nonce if present
	if ('nonce' in entry && entry.nonce !== undefined) {
		if (typeof entry.nonce !== 'bigint' && typeof entry.nonce !== 'number') {
			errors.push({ message: `nonce for ${address} must be a bigint or number` })
		} else if (
			(typeof entry.nonce === 'bigint' && entry.nonce < 0n) ||
			(typeof entry.nonce === 'number' && (entry.nonce < 0 || !Number.isInteger(entry.nonce)))
		) {
			errors.push({ message: `nonce for ${address} must be a non-negative integer` })
		}
	}

	// Validate code if present
	if ('code' in entry && entry.code !== undefined) {
		const codeValidation = validateHex(entry.code)
		if (!codeValidation.isValid) {
			errors.push({ message: `code for ${address}: ${codeValidation.message || 'Invalid code'}` })
		}
	}

	// Validate state if present
	if ('state' in entry && entry.state !== undefined) {
		if (typeof entry.state !== 'object' || entry.state === null) {
			errors.push({ message: `state for ${address} must be an object` })
		} else {
			// Validate each key-value pair in state
			for (const key in entry.state) {
				const keyValidation = validateHex(key)
				if (!keyValidation.isValid) {
					errors.push({ message: `Invalid storage key in state for ${address}: ${keyValidation.message}` })
				}

				const valueValidation = validateHex(entry.state[key])
				if (!valueValidation.isValid) {
					errors.push({ message: `Invalid storage value in state for ${address}: ${valueValidation.message}` })
				}
			}
		}
	}

	// Validate stateDiff if present
	if ('stateDiff' in entry && entry.stateDiff !== undefined) {
		if (typeof entry.stateDiff !== 'object' || entry.stateDiff === null) {
			errors.push({ message: `stateDiff for ${address} must be an object` })
		} else {
			// Validate each key-value pair in stateDiff
			for (const key in entry.stateDiff) {
				const keyValidation = validateHex(key)
				if (!keyValidation.isValid) {
					errors.push({ message: `Invalid storage key in stateDiff for ${address}: ${keyValidation.message}` })
				}

				const valueValidation = validateHex(entry.stateDiff[key])
				if (!valueValidation.isValid) {
					errors.push({ message: `Invalid storage value in stateDiff for ${address}: ${valueValidation.message}` })
				}
			}
		}
	}

	return errors
}

/**
 * @internal can break on a minor release
 * Validates call parameters using vanilla JS
 * @param {import('../BaseCall/BaseCallParams.js').BaseCallParams} action
 * @returns {Array<ValidateBaseCallParamsError>}
 */
export const validateBaseCallParams = (action) => {
	/**
	 * @type {Array<ValidateBaseCallParamsError>}
	 */
	const errors = []

	if (typeof action !== 'object' || action === null) {
		errors.push(new InvalidParamsError('Parameters must be an object'))
		return errors
	}

	// Validate boolean fields
	if ('skipBalance' in action && action.skipBalance !== undefined && typeof action.skipBalance !== 'boolean') {
		errors.push(new InvalidSkipBalanceError('skipBalance must be a boolean'))
	}

	if ('createTrace' in action && action.createTrace !== undefined && typeof action.createTrace !== 'boolean') {
		errors.push(new InvalidParamsError('createTrace must be a boolean'))
	}

	if (
		'createAccessList' in action &&
		action.createAccessList !== undefined &&
		typeof action.createAccessList !== 'boolean'
	) {
		errors.push(new InvalidParamsError('createAccessList must be a boolean'))
	}

	// Validate createTransaction field
	if ('createTransaction' in action && action.createTransaction !== undefined) {
		if (
			typeof action.createTransaction !== 'boolean' &&
			!['on-success', 'always', 'never'].includes(action.createTransaction)
		) {
			errors.push(
				new InvalidParamsError('createTransaction must be a boolean or one of: "on-success", "always", "never"'),
			)
		}
	}

	// Validate numeric fields
	if ('gasRefund' in action && action.gasRefund !== undefined) {
		if (typeof action.gasRefund !== 'bigint' || action.gasRefund < 0n) {
			errors.push(new InvalidGasRefundError('gasRefund must be a non-negative bigint'))
		}
	}

	if ('gas' in action && action.gas !== undefined) {
		if (typeof action.gas !== 'bigint' || action.gas < 0n) {
			errors.push(new InvalidGasPriceError('gas must be a non-negative bigint'))
		}
	}

	if ('value' in action && action.value !== undefined) {
		if (typeof action.value !== 'bigint' || action.value < 0n) {
			errors.push(new InvalidValueError('value must be a non-negative bigint'))
		}
	}

	if ('depth' in action && action.depth !== undefined) {
		if (typeof action.depth !== 'number' || action.depth < 0 || !Number.isInteger(action.depth)) {
			errors.push(new InvalidDepthError('depth must be a non-negative integer'))
		}
	}

	if ('gasPrice' in action && action.gasPrice !== undefined) {
		if (typeof action.gasPrice !== 'bigint' || action.gasPrice < 0n) {
			errors.push(new InvalidGasPriceError('gasPrice must be a non-negative bigint'))
		}
	}

	if ('maxFeePerGas' in action && action.maxFeePerGas !== undefined) {
		if (typeof action.maxFeePerGas !== 'bigint' || action.maxFeePerGas < 0n) {
			errors.push(new InvalidMaxFeePerGasError('maxFeePerGas must be a non-negative bigint'))
		}
	}

	if ('maxPriorityFeePerGas' in action && action.maxPriorityFeePerGas !== undefined) {
		if (typeof action.maxPriorityFeePerGas !== 'bigint' || action.maxPriorityFeePerGas < 0n) {
			errors.push(new InvalidMaxPriorityFeePerGasError('maxPriorityFeePerGas must be a non-negative bigint'))
		}
	}

	// Validate address fields
	if ('to' in action && action.to !== undefined) {
		const validation = validateAddress(action.to)
		if (!validation.isValid) {
			errors.push(new InvalidToError(validation.message || 'Invalid to address'))
		}
	}

	if ('caller' in action && action.caller !== undefined) {
		const validation = validateAddress(action.caller)
		if (!validation.isValid) {
			errors.push(new InvalidCallerError(validation.message || 'Invalid caller address'))
		}
	}

	if ('origin' in action && action.origin !== undefined) {
		const validation = validateAddress(action.origin)
		if (!validation.isValid) {
			errors.push(new InvalidOriginError(validation.message || 'Invalid origin address'))
		}
	}

	// Validate blockTag
	if ('blockTag' in action && action.blockTag !== undefined) {
		const validation = validateBlockTag(action.blockTag)
		if (!validation.isValid) {
			errors.push(new InvalidBlockError(validation.message || 'Invalid block tag'))
		}
	}

	// Validate arrays and sets
	if ('blobVersionedHashes' in action && action.blobVersionedHashes !== undefined) {
		if (!Array.isArray(action.blobVersionedHashes)) {
			errors.push(new InvalidBlobVersionedHashesError('blobVersionedHashes must be an array'))
		} else {
			// Validate each item in the array
			action.blobVersionedHashes.forEach((hash, index) => {
				const validation = validateHex(hash)
				if (!validation.isValid) {
					errors.push(
						new InvalidBlobVersionedHashesError(
							`blobVersionedHashes[${index}]: ${validation.message || 'Invalid hex value'}`,
						),
					)
				}
			})
		}
	}

	if ('selfdestruct' in action && action.selfdestruct !== undefined) {
		if (!(action.selfdestruct instanceof Set)) {
			errors.push(new InvalidSelfdestructError('selfdestruct must be a Set'))
		} else {
			// Validate each item in the set
			action.selfdestruct.forEach((address) => {
				const validation = validateAddress(address)
				if (!validation.isValid) {
					errors.push(
						new InvalidSelfdestructError(
							`selfdestruct contains invalid address: ${validation.message || 'Invalid address'}`,
						),
					)
				}
			})
		}
	}

	// Validate stateOverrideSet if present
	if ('stateOverrideSet' in action && action.stateOverrideSet !== undefined) {
		if (typeof action.stateOverrideSet !== 'object' || action.stateOverrideSet === null) {
			errors.push(new InvalidParamsError('stateOverrideSet must be an object'))
		} else {
			// Validate each address key and its entry
			for (const addr in action.stateOverrideSet) {
				// Validate address key
				const addressValidation = validateAddress(addr)
				if (!addressValidation.isValid) {
					errors.push(
						new InvalidParamsError(
							`Invalid address key in stateOverrideSet: ${addressValidation.message || 'Invalid address'}`,
						),
					)
					continue // Skip validating this entry if address is invalid
				}

				// Validate the entry for this address
				const entryErrors = validateStateOverrideEntry(action.stateOverrideSet[addr], addr)
				entryErrors.forEach((err) => {
					errors.push(new InvalidParamsError(err.message))
				})
			}
		}
	}

	return errors
}
