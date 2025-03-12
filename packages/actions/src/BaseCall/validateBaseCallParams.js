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

/**
 * @typedef {InvalidParamsError| InvalidSkipBalanceError| InvalidGasRefundError| InvalidBlockError| InvalidGasPriceError| InvalidOriginError| InvalidCallerError| InvalidDepthError| InvalidBlobVersionedHashesError} ValidateBaseCallParamsError
 */

/**
 * @internal can break on a minor release
 * Validates that the parameters are correct using manual validation
 * @param {import('../BaseCall/BaseCallParams.js').BaseCallParams} action
 */
export const validateBaseCallParams = (action) => {
	/**
	 * @type {Array<ValidateBaseCallParamsError>}
	 */
	const errors = []

	try {
		// Basic validation: check if the action is an object
		if (action === null || typeof action !== 'object') {
			errors.push(new InvalidParamsError('Parameters must be an object'))
			return errors
		}

		// Validate specific fields
		const {
			skipBalance,
			gasRefund,
			blockTag,
			gasPrice,
			origin,
			caller,
			gas,
			value,
			depth,
			selfdestruct,
			to,
			blobVersionedHashes,
			maxFeePerGas,
			maxPriorityFeePerGas,
		} = action

		// Boolean validations
		if (skipBalance !== undefined && typeof skipBalance !== 'boolean') {
			errors.push(new InvalidSkipBalanceError('skipBalance must be a boolean'))
		}

		// Bigint validations
		if (gasRefund !== undefined) {
			if (typeof gasRefund !== 'bigint') {
				errors.push(new InvalidGasRefundError('gasRefund must be a bigint'))
			} else if (gasRefund < 0n) {
				errors.push(new InvalidGasRefundError('gasRefund must be non-negative'))
			}
		}

		// Block parameter validation
		if (blockTag !== undefined) {
			const validBlockTags = ['latest', 'earliest', 'pending', 'safe', 'finalized']
			if (
				typeof blockTag !== 'string' &&
				typeof blockTag !== 'bigint' &&
				!(typeof blockTag === 'string' && /^0x[0-9a-fA-F]*$/.test(blockTag))
			) {
				errors.push(new InvalidBlockError('Invalid block parameter'))
			} else if (
				typeof blockTag === 'string' &&
				!validBlockTags.includes(blockTag) &&
				!/^0x[0-9a-fA-F]*$/.test(blockTag)
			) {
				errors.push(new InvalidBlockError('Invalid block tag'))
			}
		}

		// Gas price validation
		if (gasPrice !== undefined && typeof gasPrice !== 'bigint') {
			errors.push(new InvalidGasPriceError('gasPrice must be a bigint'))
		}

		// Origin validation
		if (origin !== undefined && (typeof origin !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(origin))) {
			errors.push(new InvalidOriginError('origin must be a valid Ethereum address'))
		}

		// Caller validation
		if (caller !== undefined && (typeof caller !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(caller))) {
			errors.push(new InvalidCallerError('caller must be a valid Ethereum address'))
		}

		// Gas validation
		if (gas !== undefined) {
			if (typeof gas !== 'bigint') {
				errors.push(new InvalidGasPriceError('gas must be a bigint'))
			} else if (gas < 0n) {
				errors.push(new InvalidGasPriceError('gas must be non-negative'))
			}
		}

		// Value validation
		if (value !== undefined) {
			if (typeof value !== 'bigint') {
				errors.push(new InvalidValueError('value must be a bigint'))
			} else if (value < 0n) {
				errors.push(new InvalidValueError('value must be non-negative'))
			}
		}

		// Depth validation
		if (depth !== undefined) {
			if (typeof depth !== 'number') {
				errors.push(new InvalidDepthError('depth must be a number'))
			} else if (depth < 0 || !Number.isInteger(depth)) {
				errors.push(new InvalidDepthError('depth must be a non-negative integer'))
			}
		}

		// Selfdestruct validation
		if (selfdestruct !== undefined) {
			if (!(selfdestruct instanceof Set)) {
				errors.push(new InvalidSelfdestructError('selfdestruct must be a Set'))
			} else {
				for (const address of selfdestruct) {
					if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
						errors.push(new InvalidSelfdestructError('All addresses in selfdestruct must be valid Ethereum addresses'))
						break
					}
				}
			}
		}

		// To address validation
		if (to !== undefined && (typeof to !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(to))) {
			errors.push(new InvalidToError('to must be a valid Ethereum address'))
		}

		// Blob versioned hashes validation
		if (blobVersionedHashes !== undefined) {
			if (!Array.isArray(blobVersionedHashes)) {
				errors.push(new InvalidBlobVersionedHashesError('blobVersionedHashes must be an array'))
			} else {
				for (let i = 0; i < blobVersionedHashes.length; i++) {
					const hash = blobVersionedHashes[i]
					if (typeof hash !== 'string' || !/^0x[0-9a-fA-F]*$/.test(hash)) {
						errors.push(new InvalidBlobVersionedHashesError(`Item at index ${i} is not a valid hex string`))
					}
				}
			}
		}

		// EIP-1559 fee validations
		if (maxFeePerGas !== undefined && typeof maxFeePerGas !== 'bigint') {
			errors.push(new InvalidMaxFeePerGasError('maxFeePerGas must be a bigint'))
		}

		if (maxPriorityFeePerGas !== undefined && typeof maxPriorityFeePerGas !== 'bigint') {
			errors.push(new InvalidMaxPriorityFeePerGasError('maxPriorityFeePerGas must be a bigint'))
		}
	} catch (error) {
		// Catch any unexpected errors and convert them to InvalidParamsError
		errors.push(new InvalidParamsError(error.message || 'Unknown validation error'))
	}

	return errors
}
