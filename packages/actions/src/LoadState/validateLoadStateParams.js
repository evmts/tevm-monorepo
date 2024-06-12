import { InvalidRequestError } from '@tevm/errors'
import { zLoadStateParams } from './zLoadStateParams.js'

/**
 * @typedef {InvalidRequestError} ValidateLoadStateParamsError
 */

/**
 * @param {import('./LoadStateParams.js').LoadStateParams} action
 * @returns {Array<ValidateLoadStateParamsError>}
 */
export const validateLoadStateParams = (action) => {
	/**
	 * @type {Array<ValidateLoadStateParamsError>}
	 */
	const errors = []

	const parsedParams = zLoadStateParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors._errors) {
			formattedErrors._errors.forEach((error) => {
				errors.push(new InvalidRequestError(error))
			})
		}
	}
	return errors
}
