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
import { validateHex } from '../internal/validators/validateHex.js'

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

	// Additional complex validations would go here
	// For example, validating stateOverrideSet and blockOverrideSet

	return errors
}
