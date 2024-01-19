import { createError } from '../common/index.js'
import { zGetAccountParams } from '../params/index.js'
import { z } from 'zod'

const looserValidation = z
	.union([
		zGetAccountParams,
		z.array(z.any()).length(0),
		z.undefined(),
		z.null(),
	])
	.transform(() => ({}))

/**
 * @param {import('@tevm/api').GetAccountParams} action
 * @returns {Array<import('@tevm/api').GetAccountError>}
 */
export const validateGetAccountParams = (action) => {
	// let's not fail if it's an empty array undefined or null
	const looseParseResult = looserValidation.safeParse(action)
	if (looseParseResult.success === true) {
		return []
	}
	// if it does fail let's return errors from the strictor validation
	/**
	 * @type {Array<import('@tevm/api').GetAccountError>}
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
