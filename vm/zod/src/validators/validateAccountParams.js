import { createError } from '../common/index.js'
import { zAccountParams } from '../params/index.js'

/**
 * @param {import('@tevm/api').AccountParams} action
 * @returns {Array<import('@tevm/api').AccountError>}
 */
export const validateAccountParams = (action) => {
	/**
	 * @type {Array<import('@tevm/api').AccountError>}
	 */
	const errors = []

	const parsedParams = zAccountParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()
		formattedErrors._errors.forEach((error) => {
			errors.push(createError('InvalidRequestError', error, String(action)))
		})
		if (formattedErrors.address) {
			formattedErrors.address._errors.forEach((error) => {
				errors.push(
					createError('InvalidAddressError', error, String(action.address)),
				)
			})
		}
		if (formattedErrors.nonce) {
			formattedErrors.nonce._errors.forEach((error) => {
				errors.push(
					createError('InvalidNonceError', error, String(action.nonce)),
				)
			})
		}
		if (formattedErrors.balance) {
			formattedErrors.balance._errors.forEach((error) => {
				errors.push(
					createError('InvalidBalanceError', error, String(action.balance)),
				)
			})
		}
		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidBytecodeError',
						error,
						String(action.deployedBytecode),
					),
				)
			})
		}
		if (formattedErrors.storageRoot) {
			formattedErrors.storageRoot._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidStorageRootError',
						error,
						String(action.storageRoot),
					),
				)
			})
		}
	}

	return errors
}
