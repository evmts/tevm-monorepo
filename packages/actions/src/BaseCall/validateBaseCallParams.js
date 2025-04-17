import {
	InvalidAddToBlockchainError,
	InvalidAddToMempoolError,
	InvalidBlobVersionedHashesError,
	InvalidBlockError,
	InvalidCallerError,
	InvalidDepthError,
	InvalidGasPriceError,
	InvalidGasRefundError,
	InvalidMaxFeePerGasError,
	InvalidMaxPriorityFeePerGasError,
	InvalidOriginError,
	InvalidParamsError,
	InvalidSelfdestructError,
	InvalidSkipBalanceError,
	InvalidToError,
	InvalidValueError,
} from '@tevm/errors'
import { zBaseCallParams } from './zBaseCallParams.js'

// TODO we are missing some validation including stateOverrides

/**
 * @typedef {InvalidParamsError| InvalidSkipBalanceError| InvalidGasRefundError| InvalidBlockError| InvalidGasPriceError| InvalidOriginError| InvalidCallerError| InvalidDepthError| InvalidBlobVersionedHashesError| InvalidAddToMempoolError| InvalidAddToBlockchainError} ValidateBaseCallParamsError
 */

/**
 * @internal can break on a minor release
 * Validates that the parameters are correct with zod
 * @param {import('../BaseCall/BaseCallParams.js').BaseCallParams} action
 */
export const validateBaseCallParams = (action) => {
	/**
	 * @type {Array<ValidateBaseCallParamsError>}
	 */
	const errors = []

	const parsedParams = zBaseCallParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		// Iterate over the general errors
		formattedErrors._errors.forEach((error) => {
			errors.push(new InvalidParamsError(error))
		})

		// Error handling for specific fields
		if (formattedErrors.skipBalance) {
			formattedErrors.skipBalance._errors.forEach((error) => {
				errors.push(new InvalidSkipBalanceError(error))
			})
		}

		if (formattedErrors.gasRefund) {
			formattedErrors.gasRefund._errors.forEach((error) => {
				errors.push(new InvalidGasRefundError(error))
			})
		}

		if (formattedErrors.blockTag) {
			formattedErrors.blockTag._errors.forEach((error) => {
				errors.push(new InvalidBlockError(error))
			})
		}

		if (formattedErrors.gas) {
			formattedErrors.gas._errors.forEach((error) => {
				errors.push(new InvalidGasPriceError(error))
			})
		}

		if (formattedErrors.origin) {
			formattedErrors.origin._errors.forEach((error) => {
				errors.push(new InvalidOriginError(error))
			})
		}

		if (formattedErrors.caller) {
			formattedErrors.caller._errors.forEach((error) => {
				errors.push(new InvalidCallerError(error))
			})
		}

		if (formattedErrors.gas) {
			formattedErrors.gas._errors.forEach((error) => {
				errors.push(new InvalidGasPriceError(error))
			})
		}

		if (formattedErrors.value) {
			formattedErrors.value._errors.forEach((error) => {
				errors.push(new InvalidValueError(error))
			})
		}

		if (formattedErrors.depth) {
			formattedErrors.depth._errors.forEach((error) => {
				errors.push(new InvalidDepthError(error))
			})
		}

		if (formattedErrors.selfdestruct) {
			formattedErrors.selfdestruct._errors.forEach((error) => {
				errors.push(new InvalidSelfdestructError(error))
			})
		}

		if (formattedErrors.to) {
			formattedErrors.to._errors.forEach((error) => {
				errors.push(new InvalidToError(error))
			})
		}

		if (formattedErrors.blobVersionedHashes) {
			formattedErrors.blobVersionedHashes._errors.forEach((error) => {
				errors.push(new InvalidBlobVersionedHashesError(error))
			})
			for (const [key, value] of Object.entries(formattedErrors.blobVersionedHashes)) {
				if (key === '_errors') continue
				if ('_errors' in value) {
					value._errors.forEach((error) => {
						errors.push(new InvalidBlobVersionedHashesError(error))
					})
				}
			}
		}

		if (formattedErrors.maxFeePerGas) {
			formattedErrors.maxFeePerGas._errors.forEach((error) => {
				errors.push(new InvalidMaxFeePerGasError(error))
			})
		}

		if (formattedErrors.maxPriorityFeePerGas) {
			formattedErrors.maxPriorityFeePerGas._errors.forEach((error) => {
				errors.push(new InvalidMaxPriorityFeePerGasError(error))
			})
		}

		if (formattedErrors.addToMempool) {
			formattedErrors.addToMempool._errors.forEach((error) => {
				errors.push(new InvalidAddToMempoolError(error))
			})
		}

		if (formattedErrors.addToBlockchain) {
			formattedErrors.addToBlockchain._errors.forEach((error) => {
				errors.push(new InvalidAddToBlockchainError(error))
			})
		}

		// if we missed an error let's make sure we handle it here
		// THis is purely defensive
		if (errors.length === 0 && parsedParams.success === false) {
			errors.push(new InvalidParamsError(parsedParams.error.message))
		}
	}

	return errors
}
