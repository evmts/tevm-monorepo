import { InvalidRequestError } from '@tevm/errors'
import { validateLoadStateParams as validateLoadState } from './zLoadStateParams.js'

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

	const validation = validateLoadState(action)

	if (!validation.isValid) {
		validation.errors.forEach((error) => {
			const errorMessage = error.message || 'Invalid parameter'
			errors.push(new InvalidRequestError(error.path ? `${error.path}: ${errorMessage}` : errorMessage))
		})
	}

	return errors
}
