import { InvalidBytecodeError, InvalidDataError, InvalidSaltError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Represents an error in call parameters validation
 * @typedef {{path?: string, message: string}} ValidationError
 */

/**
 * Validates call parameters - internal implementation
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<ValidationError> }} - Validation result
 */
export const validateCallParamsInternal = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'params must be an object' }],
		}
	}

	/**
	 * @type {Array<ValidationError>}
	 */
	const errors = []

	// Validate base call params first
	const baseValidation = validateBaseCallParams(params)
	if (baseValidation.length > 0) {
		// Convert BaseErrors to ValidationErrors
		errors.push(
			...baseValidation.map((error) => ({
				path: error.name.replace('Invalid', '').replace('Error', '').toLowerCase(),
				message: error.message,
			})),
		)
	}

	// Validate hex fields
	const hexFields = ['data', 'salt', 'code', 'deployedBytecode']
	for (const field of hexFields) {
		if (field in params && params[field] !== undefined) {
			const hexValidation = validateHex(params[field])
			if (!hexValidation.isValid) {
				errors.push({
					path: field,
					message: hexValidation.message || `Invalid ${field} value`,
				})
			}
		}
	}

	// Cannot have both code and deployedBytecode
	if (
		'code' in params &&
		params.code !== undefined &&
		'deployedBytecode' in params &&
		params.deployedBytecode !== undefined
	) {
		errors.push({
			path: '',
			message: 'Cannot have both code and deployedBytecode set',
		})
	}

	// Cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if ('createTransaction' in params && params.createTransaction === true) {
		if ('stateOverrideSet' in params && params.stateOverrideSet !== undefined) {
			errors.push({
				path: 'stateOverrideSet',
				message: 'Cannot have stateOverrideSet for createTransaction',
			})
		}

		if ('blockOverrideSet' in params && params.blockOverrideSet !== undefined) {
			errors.push({
				path: 'blockOverrideSet',
				message: 'Cannot have blockOverrideSet for createTransaction',
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Converts validation errors to TevmCallError instances
 * @param {Array<ValidationError>} errors - Validation errors to convert
 * @returns {Array<import('./TevmCallError.js').TevmCallError>} - Converted errors
 */
export const convertToTevmCallErrors = (errors) => {
	return errors.map((error) => {
		if (error.path === 'data') {
			return new InvalidDataError(error.message)
		}
		if (error.path === 'salt') {
			return new InvalidSaltError(error.message)
		}
		if (error.path === 'code' || error.path === 'deployedBytecode') {
			return new InvalidBytecodeError(error.message)
		}
		// For errors without a specific error type, create a generic InvalidDataError
		return new InvalidDataError(error.message)
	})
}
