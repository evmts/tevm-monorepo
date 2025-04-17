import { InvalidBytecodeError, InvalidDataError, InvalidSaltError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { zCallParams } from './zCallParams.js'

/**
 * @internal
 * @typedef {InvalidSaltError| InvalidDataError| InvalidBytecodeError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateCallParamsError
 */

/**
 * @internal
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
			formattedErrors.salt._errors.forEach((/** @type {string} */ error) => {
				errors.push(new InvalidSaltError(error))
			})
		}
		if (formattedErrors.data) {
			formattedErrors.data._errors.forEach((/** @type {string} */ error) => {
				errors.push(new InvalidDataError(error))
			})
		}
		if (formattedErrors.code) {
			formattedErrors.code._errors.forEach((/** @type {string} */ error) => {
				errors.push(new InvalidBytecodeError(error))
			})
		}
		if (formattedErrors._errors) {
			formattedErrors._errors.forEach((/** @type {string} */ error) => {
				errors.push(new InvalidBytecodeError(error))
			})
		}
	}

	return errors
}
