import { createError } from '../common/index.js'
import { zContractParams } from '../params/index.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * @param {import('@tevm/api').ContractParams} action
 * @returns {Array<import('@tevm/api').ContractError>}
 */
export const validateContractParams = (action) => {
	/**
	 * @type {Array<import('@tevm/api').ContractError>}
	 */
	const errors = validateBaseCallParams(action)

	const parsedParams = zContractParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

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
