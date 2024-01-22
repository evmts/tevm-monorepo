import { createError } from '../common/index.js'
import { zGetAccountParams } from '../params/index.js'

/**
 * @param {import('@tevm/actions-types').GetAccountParams} action
 * @returns {Array<import('@tevm/errors').GetAccountError>}
 */
export const validateGetAccountParams = (action) => {
	/**
	 * @type {Array<import('@tevm/errors').GetAccountError>}
	 */
	const errors = []

	const parsedParams = zGetAccountParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()
		formattedErrors._errors.forEach((error) => {
			errors.push(createError('InvalidRequestError', error, String(action)))
		})
	}

	return errors
}
