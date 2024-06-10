import { InvalidAbiError, InvalidArgsError, InvalidDeployedBytecodeError, InvalidFunctionNameError } from '@tevm/errors'
import { zScriptParams } from '../params/index.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * @typedef {InvalidAbiError| InvalidArgsError| InvalidDeployedBytecodeError| InvalidFunctionNameError | import('./validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateScriptParamsError
 */

/**
 * @param {import('@tevm/actions').ScriptParams} action
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

		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(new InvalidDeployedBytecodeError(error))
			})
		}
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
