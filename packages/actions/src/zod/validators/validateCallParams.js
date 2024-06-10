import { InvalidSaltError } from '@tevm/errors'
import { InvalidDataError, InvalidDeployedBytecodeError } from '../../../errors/dist/index.cjs'
import { zCallParams } from '../params/index.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * @typedef {InvalidSaltError| InvalidDataError| InvalidDeployedBytecodeError | import('./validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateCallParamsError
 */

/**
 * @param {import('@tevm/actions').CallParams} action
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
