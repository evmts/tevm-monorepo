import {
	InvalidAddressError,
	InvalidBalanceError,
	InvalidDeployedBytecodeError,
	InvalidNonceError,
	InvalidRequestError,
	InvalidStorageRootError,
} from '@tevm/errors'
import { validateSetAccountParams as _validateSetAccountParams } from './zSetAccountParams.js'

/**
 * @typedef {InvalidAddressError| InvalidBalanceError| InvalidDeployedBytecodeError| InvalidNonceError| InvalidRequestError| InvalidStorageRootError} ValidateSetAccountParamsError
 */

/**
 * @param {import('./SetAccountParams.js').SetAccountParams} action
 * @returns {Array<ValidateSetAccountParamsError>}
 */
export const validateSetAccountParams = (action) => {
	/**
	 * @type {Array<ValidateSetAccountParamsError>}
	 */
	const errors = []

	const validationResult = _validateSetAccountParams(action)

	if (!validationResult.isValid) {
		for (const error of validationResult.errors) {
			if (error.path === 'address') {
				errors.push(new InvalidAddressError(error.message))
			} else if (error.path === 'nonce') {
				errors.push(new InvalidNonceError(error.message))
			} else if (error.path === 'balance') {
				errors.push(new InvalidBalanceError(error.message))
			} else if (error.path === 'deployedBytecode') {
				errors.push(new InvalidDeployedBytecodeError(error.message))
			} else if (error.path === 'storageRoot') {
				errors.push(new InvalidStorageRootError(error.message))
			} else if (error.path === 'state' || error.path.startsWith('state.')) {
				errors.push(new InvalidRequestError(error.message))
			} else if (error.path === 'stateDiff' || error.path.startsWith('stateDiff.')) {
				errors.push(new InvalidRequestError(error.message))
			} else if (error.path === 'throwOnFail') {
				errors.push(new InvalidRequestError(error.message))
			} else {
				errors.push(new InvalidRequestError(error.message))
			}
		}
	}

	return errors
}
