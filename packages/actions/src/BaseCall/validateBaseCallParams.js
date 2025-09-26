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
import { treeifyError } from 'zod'
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
		const formattedErrors = treeifyError(parsedParams.error)

		// Iterate over the general errors
		formattedErrors.errors.forEach((error) => {
			errors.push(new InvalidParamsError(error))
		})

		// Error handling for specific fields
		if (formattedErrors.properties?.skipBalance) {
			formattedErrors.properties.skipBalance.errors.forEach((error) => {
				errors.push(new InvalidSkipBalanceError(error))
			})
		}

		if (formattedErrors.properties?.gasRefund) {
			formattedErrors.properties.gasRefund.errors.forEach((error) => {
				errors.push(new InvalidGasRefundError(error))
			})
		}

		if (formattedErrors.properties?.blockTag) {
			formattedErrors.properties.blockTag.errors.forEach((error) => {
				errors.push(new InvalidBlockError(error))
			})
		}

		if (formattedErrors.properties?.gas) {
			formattedErrors.properties.gas.errors.forEach((error) => {
				errors.push(new InvalidGasPriceError(error))
			})
		}

		if (formattedErrors.properties?.origin) {
			formattedErrors.properties.origin.errors.forEach((error) => {
				errors.push(new InvalidOriginError(error))
			})
		}

		if (formattedErrors.properties?.caller) {
			formattedErrors.properties.caller.errors.forEach((error) => {
				errors.push(new InvalidCallerError(error))
			})
		}

		if (formattedErrors.properties?.gas) {
			formattedErrors.properties.gas.errors.forEach((error) => {
				errors.push(new InvalidGasPriceError(error))
			})
		}

		if (formattedErrors.properties?.value) {
			formattedErrors.properties.value.errors.forEach((error) => {
				errors.push(new InvalidValueError(error))
			})
		}

		if (formattedErrors.properties?.depth) {
			formattedErrors.properties.depth.errors.forEach((error) => {
				errors.push(new InvalidDepthError(error))
			})
		}

		if (formattedErrors.properties?.selfdestruct) {
			formattedErrors.properties.selfdestruct.errors.forEach((error) => {
				errors.push(new InvalidSelfdestructError(error))
			})
		}

		if (formattedErrors.properties?.to) {
			formattedErrors.properties.to.errors.forEach((error) => {
				errors.push(new InvalidToError(error))
			})
		}

		if (formattedErrors.properties?.blobVersionedHashes) {
			formattedErrors.properties.blobVersionedHashes.errors.forEach((error) => {
				errors.push(new InvalidBlobVersionedHashesError(error))
			})
			for (const [key, value] of Object.entries(formattedErrors.properties?.blobVersionedHashes)) {
				if (key === 'errors') continue
				if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && 'errors' in value[0]) {
					// value is { errors: string[] }[]
					value.forEach((item) => {
						if (typeof item === 'object' && 'errors' in item) {
							item.errors.forEach((error) => {
								errors.push(new InvalidBlobVersionedHashesError(error))
							})
						}
					})
				}
			}
		}

		if (formattedErrors.properties?.maxFeePerGas) {
			formattedErrors.properties.maxFeePerGas.errors.forEach((error) => {
				errors.push(new InvalidMaxFeePerGasError(error))
			})
		}

		if (formattedErrors.properties?.maxPriorityFeePerGas) {
			formattedErrors.properties.maxPriorityFeePerGas.errors.forEach((error) => {
				errors.push(new InvalidMaxPriorityFeePerGasError(error))
			})
		}

		if (formattedErrors.properties?.addToMempool) {
			formattedErrors.properties.addToMempool.errors.forEach((error) => {
				errors.push(new InvalidAddToMempoolError(error))
			})
		}

		if (formattedErrors.properties?.addToBlockchain) {
			formattedErrors.properties.addToBlockchain.errors.forEach((error) => {
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
