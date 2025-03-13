import {
	InvalidAbiError,
	InvalidAddressError,
	InvalidArgsError,
	InvalidBytecodeError,
	InvalidFunctionNameError,
	InvalidParamsError,
} from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateContractParams as validateContract } from './zContractParams.js'

/**
 * @typedef {InvalidAbiError| InvalidAddressError| InvalidArgsError| InvalidFunctionNameError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateContractParamsError
 */

/**
 * @param {import('./ContractParams.js').ContractParams} action
 * @returns {Array<ValidateContractParamsError>}
 */
export const validateContractParams = (action) => {
	/**
	 * @type {Array<ValidateContractParamsError>}
	 */
	const errors = validateBaseCallParams(action)

	const validation = validateContract(action)

	if (!validation.isValid) {
		validation.errors.forEach((error) => {
			const errorMessage = error.message || 'Invalid parameter'

			// Add appropriate error types based on the error message
			if (errorMessage.includes('code')) {
				errors.push(new InvalidBytecodeError(errorMessage))
			} else if (errorMessage.includes('deployedBytecode')) {
				errors.push(new InvalidBytecodeError(errorMessage))
			} else if (errorMessage.includes('abi')) {
				errors.push(new InvalidAbiError(errorMessage))
			} else if (errorMessage.includes('args')) {
				errors.push(new InvalidArgsError(errorMessage))
			} else if (errorMessage.includes('functionName')) {
				errors.push(new InvalidFunctionNameError(errorMessage))
			} else if (errorMessage.includes('to address')) {
				errors.push(new InvalidAddressError(errorMessage))
			} else {
				errors.push(new InvalidParamsError(errorMessage))
			}
		})
	}

	return errors
}
