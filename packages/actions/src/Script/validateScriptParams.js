import { InvalidAbiError, InvalidArgsError, InvalidDeployedBytecodeError, InvalidFunctionNameError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { zScriptParams } from './zScriptParams.js'

/**
 * @typedef {InvalidAbiError| InvalidArgsError| InvalidDeployedBytecodeError| InvalidFunctionNameError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateScriptParamsError
 */

/**
 * @deprecated
 * @param {import('./ScriptParams.js').ScriptParams} action
 * @returns {Array<ValidateScriptParamsError>}
 */
export const validateScriptParams = (action) => {
	/**
	 * @type {Array<ValidateScriptParamsError>}
	 */
	const errors = validateBaseCallParams(action)

	const parsedParams = zScriptParams.safeParse(action)

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
	}

	return errors
}
