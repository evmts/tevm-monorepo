import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateHex } from '../internal/zod/zHex.js'

/**
 * Validates call parameters
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateCallParams = (params) => {
	if (typeof params !== 'object' || params === null) {
		return { 
			isValid: false, 
			errors: [{ path: '', message: 'params must be an object' }] 
		}
	}
	
	const errors = []
	
	// Validate base call params first
	const baseValidation = validateBaseCallParams(params)
	if (baseValidation.errors && baseValidation.errors.length > 0) {
		errors.push(...baseValidation.errors)
	}
	
	// Validate hex fields
	const hexFields = ['data', 'salt', 'code', 'deployedBytecode']
	for (const field of hexFields) {
		if (field in params && params[field] !== undefined) {
			const hexValidation = validateHex(params[field])
			if (!hexValidation.isValid) {
				errors.push({
					path: field,
					message: hexValidation.message || `Invalid ${field} value`
				})
			}
		}
	}
	
	// Cannot have both code and deployedBytecode
	if ('code' in params && params.code !== undefined && 
		'deployedBytecode' in params && params.deployedBytecode !== undefined) {
		errors.push({
			path: '',
			message: 'Cannot have both code and deployedBytecode set'
		})
	}
	
	// Cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if ('createTransaction' in params && params.createTransaction === true) {
		if ('stateOverrideSet' in params && params.stateOverrideSet !== undefined) {
			errors.push({
				path: 'stateOverrideSet',
				message: 'Cannot have stateOverrideSet for createTransaction'
			})
		}
		
		if ('blockOverrideSet' in params && params.blockOverrideSet !== undefined) {
			errors.push({
				path: 'blockOverrideSet',
				message: 'Cannot have blockOverrideSet for createTransaction'
			})
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	}
}
