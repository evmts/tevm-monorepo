import { createError } from '../common/index.js'
import { zForkParams } from '../params/index.js'

/**
 * @param {import('@tevm/actions-types').ForkParams} action
 */
export const validateForkParams = (action) => {
	const parsedParams = zForkParams.safeParse(action)

	/**
	 * @type {import('@tevm/errors').ForkError[]}
	 */
	const errors = []

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors._errors) {
			formattedErrors._errors.forEach((error) => {
				errors.push(createError('FailedToForkError', error))
			})
		}
		if (formattedErrors.url) {
			formattedErrors.url._errors.forEach((error) => {
				errors.push(createError('InvalidUrlError', error, String(action.url)))
			})
		}
		if (formattedErrors.blockTag) {
			formattedErrors.blockTag._errors.forEach((error) => {
				errors.push(
					createError('InvalidBlockError', error, String(action.blockTag)),
				)
			})
		}
	}

	return errors
}
