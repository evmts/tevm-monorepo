import {
	InvalidAddressError,
	InvalidBalanceError,
	InvalidDeployedBytecodeError,
	InvalidNonceError,
	InvalidRequestError,
	InvalidStorageRootError,
} from '@tevm/errors'
import { zSetAccountParams } from '../params/index.js'

/**
 * @typedef {InvalidAddressError| InvalidBalanceError| InvalidDeployedBytecodeError| InvalidNonceError| InvalidRequestError| InvalidStorageRootError} ValidateSetAccountParamsError
 */

/**
 * @param {import('../../tevm/SetAccountParams.js').SetAccountParams} action
 * @returns {Array<ValidateSetAccountParamsError>}
 */
export const validateSetAccountParams = (action) => {
	/**
	 * @type {Array<ValidateSetAccountParamsError>}
	 */
	const errors = []

	const parsedParams = zSetAccountParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()
		formattedErrors._errors.forEach((error) => {
			errors.push(new InvalidRequestError(error))
		})
		if (formattedErrors.address) {
			formattedErrors.address._errors.forEach((error) => {
				errors.push(new InvalidAddressError(error))
			})
		}
		if (formattedErrors.nonce) {
			formattedErrors.nonce._errors.forEach((error) => {
				errors.push(new InvalidNonceError(error))
			})
		}
		if (formattedErrors.balance) {
			formattedErrors.balance._errors.forEach((error) => {
				errors.push(new InvalidBalanceError(error))
			})
		}
		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(new InvalidDeployedBytecodeError(error))
			})
		}
		if (formattedErrors.storageRoot) {
			formattedErrors.storageRoot._errors.forEach((error) => {
				errors.push(new InvalidStorageRootError(error))
			})
		}
	}

	return errors
}
