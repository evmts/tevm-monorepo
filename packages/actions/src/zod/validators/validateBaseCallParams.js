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
import { InvalidSelfdestructError, InvalidToError, InvalidValueError } from '../../../errors/dist/index.cjs'
import { zBaseCallParams } from '../params/index.js'

/**
 * @typedef {InvalidParamsError| InvalidSkipBalanceError| InvalidGasRefundError| InvalidBlockError| InvalidGasPriceError| InvalidOriginError| InvalidCallerError| InvalidDepthError| InvalidBlobVersionedHashesError} ValidateBaseCallParamsError
 */

/**
 * @param {import('@tevm/actions').BaseCallParams} action
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
		}
	}

	return errors
}
