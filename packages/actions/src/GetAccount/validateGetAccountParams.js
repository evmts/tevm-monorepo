import { InvalidAddressError, InvalidRequestError } from '@tevm/errors'
import { validateBaseParams } from '../BaseCall/validateBaseParams.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateBlockParam } from '../internal/validators/validateBlockParam.js'

/**
 * @typedef {InvalidRequestError|InvalidAddressError} ValidateGetAccountParamsError
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

	if (typeof action !== 'object' || action === null) {
		errors.push(new InvalidRequestError('params must be an object'))
		return errors
	}

	// Validate base params
	const baseValidation = validateBaseParams(action)
	if (!baseValidation.isValid) {
		baseValidation.errors.forEach((error) => {
			if (error.path === 'throwOnFail') {
				errors.push(
					new InvalidRequestError(
						`Invalid throwOnFail param. throwOnFail must be a boolean or not provided. ${error.message}`,
					),
				)
			} else {
				errors.push(new InvalidRequestError(error.message))
			}
		})
	}

	// Validate address (required)
	if (!('address' in action) || action.address === undefined) {
		errors.push(new InvalidAddressError('address is required'))
	} else {
		const addressValidation = validateAddress(action.address)
		if (!addressValidation.isValid) {
			errors.push(new InvalidAddressError(`Invalid address param. ${addressValidation.message}`))
		}
	}

	// Validate returnStorage if present
	if ('returnStorage' in action && action.returnStorage !== undefined) {
		if (typeof action.returnStorage !== 'boolean') {
			errors.push(
				new InvalidRequestError('Invalid returnStorage param. returnStorage must be a boolean or not provided.'),
			)
		}
	}

	// Validate blockTag if present
	if ('blockTag' in action && action.blockTag !== undefined) {
		const blockTagValidation = validateBlockParam(action.blockTag)
		if (!blockTagValidation.isValid) {
			errors.push(new InvalidRequestError(`Invalid blockTag param. ${blockTagValidation.message}`))
		}
	}

	return errors
}
