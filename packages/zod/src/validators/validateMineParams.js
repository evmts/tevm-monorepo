import { createError } from '../common/index.js'
import { zMineParams } from '../params/index.js'

/**
 * @param {import('@tevm/actions-types').MineParams} action
 * @returns {Array<import('@tevm/errors').MineError>}
 */
export const validateMineParams = (action) => {
	/**
	 * @type {Array<import('@tevm/errors').MineError>}
	 */
	const errors = []

	const parsedParams = zMineParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()
		formattedErrors._errors.forEach((error) => {
			errors.push(createError('InvalidRequestError', error, String(action)))
		})
		if (formattedErrors.blockCount) {
			formattedErrors.blockCount._errors.forEach((error) => {
				errors.push(createError('InvalidAddressError', error, String(action.blockCount)))
			})
		}
		if (formattedErrors.interval) {
			formattedErrors.interval._errors.forEach((error) => {
				errors.push(createError('InvalidNonceError', error, String(action.interval)))
			})
		}
		if (formattedErrors.throwOnFail) {
			formattedErrors.throwOnFail._errors.forEach((error) => {
				errors.push(createError('InvalidBalanceError', error, String(action.throwOnFail)))
			})
		}
	}

	return errors
}
