import { InvalidRequestError } from '@tevm/errors'
import { zLoadStateParams } from './zLoadStateParams.js'

/**
 * Type for errors returned by validateLoadStateParams.
 * @typedef {InvalidRequestError} ValidateLoadStateParamsError
 */

/**
 * Validates the parameters for loading the state into the VM.
 *
 * @param {import('./LoadStateParams.js').LoadStateParams} action - The parameters for the load state action.
 * @returns {Array<ValidateLoadStateParamsError>} - An array of errors, if any.
 *
 * @example
 * ```typescript
 * import { validateLoadStateParams } from 'tevm/actions'
 *
 * const params = { state: {...}  }
 * const errors = validateLoadStateParams(params)
 * if (errors.length > 0) {
 *   console.error('Validation errors:', errors)
 * }
 * ```
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
