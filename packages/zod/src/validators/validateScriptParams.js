import { createError } from '../common/index.js'
import { zScriptParams } from '../params/index.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * @param {import('@tevm/actions-types').ScriptParams} action
 */
export const validateScriptParams = (action) => {
	/**
	 * @type {Array<import('@tevm/errors').ScriptError>}
	 */
	const errors = validateBaseCallParams(action)

	const parsedParams = zScriptParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidDeployedBytecodeError',
						error,
						String(action.deployedBytecode),
					),
				)
			})
		}
		if (formattedErrors.abi) {
			formattedErrors.abi._errors.forEach((error) => {
				errors.push(
					createError('InvalidAbiError', error, JSON.stringify(action.abi)),
				)
			})
		}
		if (formattedErrors.args) {
			formattedErrors.args._errors.forEach((error) => {
				errors.push(createError('InvalidArgsError', error))
			})
		}
		if (formattedErrors.functionName) {
			formattedErrors.functionName._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidFunctionNameError',
						error,
						String(action.functionName),
					),
				)
			})
		}
	}

	return errors
}
