import { createError } from '../common/index.js'
import { zLoadStateParams } from '../params/zLoadStateParams.js'

/**
 * @param {import('@tevm/actions-types').LoadStateParams} action
 */
export const validateLoadStateParams = (action) => {
	/**
	 * @type {Array<import('@tevm/errors').LoadStateError>}
	 */
	const errors = []

	const parsedParams = zLoadStateParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors._errors) {
			formattedErrors._errors.forEach((error) => {
				errors.push(
					createError('InvalidRequestError', error, JSON.stringify(action)),
				)
			})
		}
	}
	return errors
}
