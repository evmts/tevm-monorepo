import { InvalidAddressError, InvalidRequestError } from '@tevm/errors'
import { zGetAccountParams } from './zGetAccountParams.js'

/**
 * @typedef {InvalidRequestError} ValidateGetAccountParamsError
 */

/**
 * @param {import('./GetAccountParams.js').GetAccountParams} action
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
		if (formattedErrors.throwOnFail) {
			for (const err of formattedErrors.throwOnFail._errors) {
				errors.push(
					new InvalidRequestError(`Invalid throwOnFail param. throwOnFail must be a boolean or not provided. ${err}`),
				)
			}
		}
		if (formattedErrors.returnStorage) {
			for (const err of formattedErrors.returnStorage._errors) {
				errors.push(
					new InvalidRequestError(
						`Invalid returnStorage param. returnStorage must be a boolean or not provided. ${err}`,
					),
				)
			}
		}
		if (formattedErrors.address) {
			for (const err of formattedErrors.address._errors) {
				errors.push(new InvalidAddressError(`Invalid address param. ${err}`))
			}
		}
		if (formattedErrors.blockTag) {
			for (const err of formattedErrors.blockTag._errors) {
				errors.push(new InvalidRequestError(`Invalid blockTag param. ${err}`))
			}
		}
		formattedErrors._errors.forEach((error) => {
			errors.push(new InvalidRequestError(error))
		})
	}

	return errors
}
