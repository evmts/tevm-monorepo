import { InvalidAddressError, InvalidBalanceError, InvalidNonceError, InvalidRequestError } from '@tevm/errors'
import { validateBaseParams } from '../BaseCall/validateBaseParams.js'
import { validateMineEvents } from './validateMineEvents.js'

/**
 * @typedef {InvalidAddressError| InvalidBalanceError| InvalidNonceError | InvalidRequestError} ValidateMineParamsError
 */

/**
 * @param {import('./MineParams.js').MineParams} action
 * @returns {Array<ValidateMineParamsError>}
 */
export const validateMineParams = (action) => {
	/**
	 * @type {Array<ValidateMineParamsError>}
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
				errors.push(new InvalidBalanceError(error.message))
			} else {
				errors.push(new InvalidRequestError(error.message))
			}
		})
	}

	// Validate blockCount if present (support both blockCount and blocks for backwards compatibility)
	if ('blockCount' in action && action.blockCount !== undefined) {
		if (typeof action.blockCount !== 'number' || !Number.isInteger(action.blockCount) || action.blockCount < 0) {
			errors.push(new InvalidAddressError('blockCount must be a non-negative integer'))
		}
	}

	// Support 'blocks' parameter for backwards compatibility
	if ('blocks' in action && action.blocks !== undefined) {
		if (typeof action.blocks !== 'number' || !Number.isInteger(action.blocks) || action.blocks < 0) {
			errors.push(new InvalidAddressError('blocks must be a non-negative integer'))
		}
	}

	// Validate interval if present
	if ('interval' in action && action.interval !== undefined) {
		if (typeof action.interval !== 'number' || !Number.isInteger(action.interval) || action.interval < 0) {
			errors.push(new InvalidNonceError('interval must be a non-negative integer'))
		}
	}

	// Validate event handlers
	const eventsValidation = validateMineEvents(action)
	if (!eventsValidation.isValid) {
		eventsValidation.errors.forEach((error) => {
			errors.push(new InvalidRequestError(error.message))
		})
	}

	return errors
}
