import { InvalidRequestError } from '@tevm/errors'
import { zGetAccountParams } from '../params/index.js'

/**
 * @typedef {InvalidRequestError} ValidateGetAccountParamsError
 */

/**
 * @param {import('@tevm/actions').GetAccountParams} action
 * @returns {Array<ValidateGetAccountParamsError>}
 */
export const validateGetAccountParams = (action) => {
	/**
	 * @type {Array<ValidateGetAccountParamsError>}
	 */
	const errors = []

	const parsedParams = zGetAccountParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()
		formattedErrors._errors.forEach((error) => {
			errors.push(new InvalidRequestError(error))
		})
	}

	return errors
}
