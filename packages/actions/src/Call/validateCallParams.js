import { InvalidBytecodeError, InvalidDataError, InvalidSaltError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateCallParamsJS } from './zCallParams.js'

/**
 * @internal
 * @typedef {InvalidSaltError| InvalidDataError| InvalidBytecodeError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateCallParamsError
 */

/**
 * @internal
 * @param {import('../Call/CallParams.js').CallParams} action
 * @returns {Array<ValidateCallParamsError>}
 */
export const validateCallParams = (action) => {
	/**
	 * @type {Array<ValidateCallParamsError>}
	 */
	const errors = validateBaseCallParams(action)

	const validation = validateCallParamsJS(action)

	if (!validation.isValid) {
		for (const error of validation.errors) {
			switch (error.path) {
				case 'salt':
					errors.push(new InvalidSaltError(error.message))
					break
				case 'data':
					errors.push(new InvalidDataError(error.message))
					break
				case 'code':
				case 'deployedBytecode':
					errors.push(new InvalidBytecodeError(error.message))
					break
				default:
					// General errors or empty path
					if (error.message.includes('code') || error.message.includes('bytecode')) {
						errors.push(new InvalidBytecodeError(error.message))
					}
					break
			}
		}
	}

	return errors
}
