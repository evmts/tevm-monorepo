import { z } from 'zod'
import { zBaseCallParams } from '../BaseCall/zBaseCallParams.js'
import { zHex } from '../internal/zod/zHex.js'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

// Create a Zod schema for call parameters
export const zCallParams = zBaseCallParams.extend({
  data: zHex.optional(),
  salt: zHex.optional(),
  code: zHex.optional(),
  deployedBytecode: zHex.optional(),
}).refine(
  (data) => {
    // Cannot have both code and deployedBytecode
    return !(data.code !== undefined && data.deployedBytecode !== undefined)
  },
  {
    message: 'Cannot have both code and deployedBytecode set',
    path: ['code', 'deployedBytecode'],
  }
).refine(
  (data) => {
    // Cannot have stateOverrideSet with createTransaction
    return !(data.createTransaction === true && data.stateOverrideSet !== undefined)
  },
  {
    message: 'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
    path: ['stateOverrideSet'],
  }
).refine(
  (data) => {
    // Cannot have blockOverrideSet with createTransaction
    return !(data.createTransaction === true && data.blockOverrideSet !== undefined)
  },
  {
    message: 'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
    path: ['blockOverrideSet'],
  }
)

/**
 * Validates call parameters (internal validation function)
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateCallParamsJS = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'params must be an object' }],
		}
	}

	const errors = []

	// Validate base call params first
	const baseValidation = validateBaseCallParams(params)
	if (baseValidation.length > 0) {
		errors.push(...baseValidation.map((err) => ({ path: err.name, message: err.message })))
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
