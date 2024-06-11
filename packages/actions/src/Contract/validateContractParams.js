import { InvalidAbiError, InvalidAddressError, InvalidArgsError, InvalidFunctionNameError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { zContractParams } from './zContractParams.js'

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

	const parsedParams = zContractParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors.abi) {
			formattedErrors.abi._errors.forEach((error) => {
				errors.push(new InvalidAbiError(error))
			})
		}
		if (formattedErrors.args) {
			formattedErrors.args._errors.forEach((error) => {
				errors.push(new InvalidArgsError(error))
			})
		}
		if (formattedErrors.functionName) {
			formattedErrors.functionName._errors.forEach((error) => {
				errors.push(new InvalidFunctionNameError(error))
			})
		}
		if (formattedErrors.to) {
			formattedErrors.to._errors.forEach((error) => {
				errors.push(new InvalidAddressError(error))
			})
		}
	}

	return errors
}
