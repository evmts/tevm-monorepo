import { InvalidSaltError } from '@tevm/errors'
import { InvalidDataError, InvalidDeployedBytecodeError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { zCallParams } from './zCallParams.js'

/**
 * @typedef {InvalidSaltError| InvalidDataError| InvalidDeployedBytecodeError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateCallParamsError
 */

/**
 * @param {import('../Call/CallParams.js').CallParams} action
 */
export const validateCallParams = (action) => {
	/**
	 * @type {Array<ValidateCallParamsError>}
	 */
	const errors = validateBaseCallParams(action)

	const parsedParams = zCallParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors.salt) {
			formattedErrors.salt._errors.forEach((error) => {
				errors.push(new InvalidSaltError(error))
			})
		}
		if (formattedErrors.data) {
			formattedErrors.data._errors.forEach((error) => {
				errors.push(new InvalidDataError(error))
			})
		}
		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(new InvalidDeployedBytecodeError(error))
			})
		}
	}

	return errors
}
