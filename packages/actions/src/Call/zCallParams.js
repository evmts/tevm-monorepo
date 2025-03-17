import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Validates call parameters using Zod
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @typedef {Record<string, any>} CallParams
 */
export const validateCallParamsZod = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'params must be an object' }],
		}
	}
	
	/** @type {CallParams} */
	const validParams = params;

	const errors = []

	// Validate base call params first
	const baseErrors = validateBaseCallParams(params)
	if (baseErrors && baseErrors.length > 0) {
		// Convert error objects to simple {path, message} format
		errors.push(
			...baseErrors.map((err) => ({
				path: '',
				message: err.message || 'Invalid parameter',
			})),
		)
	}

	// Validate hex fields
	const hexFields = ['data', 'salt', 'code', 'deployedBytecode']
	for (const field of hexFields) {
		if (Object.prototype.hasOwnProperty.call(validParams, field) && validParams[field] !== undefined) {
			// We need to use string indexing but in a type-safe way for JavaScript
			const fieldValue = validParams[field]
			const hexValidation = validateHex(fieldValue)
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
		Object.prototype.hasOwnProperty.call(validParams, 'code') &&
		validParams['code'] !== undefined &&
		Object.prototype.hasOwnProperty.call(validParams, 'deployedBytecode') &&
		validParams['deployedBytecode'] !== undefined
	) {
		errors.push({
			path: '',
			message: 'Cannot have both code and deployedBytecode set',
		})
	}

	// Cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if (Object.prototype.hasOwnProperty.call(validParams, 'createTransaction') && validParams['createTransaction'] === true) {
		if (Object.prototype.hasOwnProperty.call(validParams, 'stateOverrideSet') && validParams['stateOverrideSet'] !== undefined) {
			errors.push({
				path: 'stateOverrideSet',
				message: 'Cannot have stateOverrideSet for createTransaction',
			})
		}

		if (Object.prototype.hasOwnProperty.call(validParams, 'blockOverrideSet') && validParams['blockOverrideSet'] !== undefined) {
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