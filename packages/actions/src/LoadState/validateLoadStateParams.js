import { InvalidRequestError } from '@tevm/errors'
import { zLoadStateParams } from './zLoadStateParams.js'

/**
 * Type for errors returned by validateLoadStateParams.
 * @typedef {InvalidRequestError} ValidateLoadStateParamsError
 */

/**
 * Validates the parameters for loading the state into the VM.
 *
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

		if (formattedErrors.state?._errors) {
			formattedErrors.state._errors.forEach((error) => {
				errors.push(new InvalidRequestError(`Invalid state: ${error}`))
			})
		}
	}
	return errors
}
