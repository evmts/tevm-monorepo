import { createError } from '../common/index.js'
import { zBaseCallParams } from '../params/index.js'

/**
 * @param {import('@tevm/api').BaseCallParams} action
 */
export const validateBaseCallParams = (action) => {
	/**
	 * @type {Array<import('@tevm/api').BaseCallError>}
	 */
	const errors = []

	const parsedParams = zBaseCallParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		// Iterate over the general errors
		formattedErrors._errors.forEach((error) => {
			errors.push(
				createError('InvalidRequestError', error, JSON.stringify(action)),
			)
		})

		// Error handling for specific fields
		if (formattedErrors.skipBalance) {
			formattedErrors.skipBalance._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidSkipBalanceError',
						error,
						String(action.skipBalance),
					),
				)
			})
		}

		if (formattedErrors.gasRefund) {
			formattedErrors.gasRefund._errors.forEach((error) => {
				errors.push(
					createError('InvalidGasRefundError', error, String(action.gasRefund)),
				)
			})
		}

		if (formattedErrors.block) {
			formattedErrors.block._errors.forEach((error) => {
				errors.push(
					createError('InvalidBlockError', error, JSON.stringify(action.block)),
				)
			})
		}

		if (formattedErrors.gasPrice) {
			formattedErrors.gasPrice._errors.forEach((error) => {
				errors.push(
					createError('InvalidGasPriceError', error, String(action.gasPrice)),
				)
			})
		}

		if (formattedErrors.origin) {
			formattedErrors.origin._errors.forEach((error) => {
				errors.push(
					createError('InvalidOriginError', error, String(action.origin)),
				)
			})
		}

		if (formattedErrors.caller) {
			formattedErrors.caller._errors.forEach((error) => {
				errors.push(
					createError('InvalidCallerError', error, String(action.caller)),
				)
			})
		}

		if (formattedErrors.gasLimit) {
			formattedErrors.gasLimit._errors.forEach((error) => {
				errors.push(
					createError('InvalidGasLimitError', error, String(action.gasLimit)),
				)
			})
		}

		if (formattedErrors.value) {
			formattedErrors.value._errors.forEach((error) => {
				errors.push(
					createError('InvalidValueError', error, String(action.value)),
				)
			})
		}

		if (formattedErrors.depth) {
			formattedErrors.depth._errors.forEach((error) => {
				errors.push(
					createError('InvalidDepthError', error, String(action.depth)),
				)
			})
		}

		if (formattedErrors.selfdestruct) {
			formattedErrors.selfdestruct._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidSelfdestructError',
						error,
						JSON.stringify(action.selfdestruct),
					),
				)
			})
		}

		if (formattedErrors.to) {
			formattedErrors.to._errors.forEach((error) => {
				errors.push(createError('InvalidToError', error, String(action.to)))
			})
		}

		if (formattedErrors.blobVersionedHashes) {
			formattedErrors.blobVersionedHashes._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidBlobVersionedHashesError',
						error,
						JSON.stringify(action.blobVersionedHashes),
					),
				)
			})
		}
	}

	return errors
}
