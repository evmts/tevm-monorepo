import { InvalidParamsError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateAbi } from '../internal/validators/validateAbi.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateHex } from '../internal/validators/validateHex.js'

/**
 * Validates contract parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError | InvalidParamsError> }} - Validation result
 */
const validateContractParamsInternal = (value) => {
	// First get base call params validation errors
	const baseErrors = validateBaseCallParams(value)

	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [new InvalidParamsError('Parameters must be an object')],
		}
	}

	const errors = [...baseErrors]

	// Validate abi (required)
	if (!('abi' in value) || value.abi === undefined) {
		errors.push(new InvalidParamsError('Missing required field: abi'))
	} else {
		const abiValidation = validateAbi(value.abi)
		if (!abiValidation.isValid) {
			errors.push(new InvalidParamsError(abiValidation.message || 'Invalid ABI'))
		}
	}

	// Validate functionName (required)
	if (!('functionName' in value) || value.functionName === undefined) {
		errors.push(new InvalidParamsError('Missing required field: functionName'))
	} else if (typeof value.functionName !== 'string') {
		errors.push(new InvalidParamsError('functionName must be a string'))
	}

	// Validate args if present
	if ('args' in value && value.args !== undefined) {
		if (!Array.isArray(value.args)) {
			errors.push(new InvalidParamsError('args must be an array'))
		}
	}

	// Validate to if present
	if ('to' in value && value.to !== undefined) {
		const toValidation = validateAddress(value.to)
		if (!toValidation.isValid) {
			errors.push(new InvalidParamsError(toValidation.message || 'Invalid to address'))
		}
	}

	// Validate code if present
	if ('code' in value && value.code !== undefined) {
		const codeValidation = validateHex(value.code)
		if (!codeValidation.isValid) {
			errors.push(new InvalidParamsError(codeValidation.message || 'Invalid code'))
		}
	}

	// Validate deployedBytecode if present
	if ('deployedBytecode' in value && value.deployedBytecode !== undefined) {
		const bytecodeValidation = validateHex(value.deployedBytecode)
		if (!bytecodeValidation.isValid) {
			errors.push(new InvalidParamsError(bytecodeValidation.message || 'Invalid deployedBytecode'))
		}
	}

	// Validate must have either code, to, or deployedBytecode
	const hasCode = 'code' in value && value.code !== undefined
	const hasTo = 'to' in value && value.to !== undefined
	const hasDeployedBytecode = 'deployedBytecode' in value && value.deployedBytecode !== undefined
	
	if (!hasCode && !hasTo && !hasDeployedBytecode) {
		errors.push(new InvalidParamsError('Must have either code, to, or deployedBytecode'))
	}

	// Validate cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if ('createTransaction' in value && value.createTransaction) {
		if ('stateOverrideSet' in value && value.stateOverrideSet) {
			errors.push(new InvalidParamsError('Cannot have stateOverrideSet for createTransaction'))
		}
		if ('blockOverrideSet' in value && value.blockOverrideSet) {
			errors.push(new InvalidParamsError('Cannot have blockOverrideSet for createTransaction'))
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * For backward compatibility with Zod interface
 * @type {{
 *   parse: (value: any) => any,
 *   safeParse: (value: any) => {success: boolean, data: any} | {success: boolean, error: {format: () => {_errors: string[]} & Record<string, {_errors: string[]}>}}
 * }}
 */
export const zContractParams = {
	/**
	 * @param {any} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateContractParamsInternal(value)
		if (!validation.isValid) {
			throw new InvalidParamsError(validation.errors[0]?.message || 'Invalid contract parameters')
		}
		return value
	},
	/**
	 * @param {any} value
	 * @returns {{success: boolean, data: any} | {success: boolean, error: {format: () => {_errors: string[]} & Record<string, {_errors: string[]}>}}}
	 */
	safeParse: (value) => {
		const validation = validateContractParamsInternal(value)
		if (validation.isValid) {
			return { success: true, data: value }
		}
		return {
			success: false,
			error: {
				format: () => {
					/** @type {Record<string, {_errors: string[]}> & {_errors: string[]}} */
					const formatted = /** @type {any} */ ({ _errors: [] })
					
					// Create a valid Record right away with required shape
					formatted.code = { _errors: [] }
					formatted.to = { _errors: [] }
					formatted.abi = { _errors: [] }
					formatted.args = { _errors: [] }
					formatted.functionName = { _errors: [] }
					formatted.deployedBytecode = { _errors: [] }
					
					validation.errors.forEach((err) => {
						// Map errors to appropriate fields
						if (err.message.includes('code')) {
							if (!formatted['code']) {
								formatted['code'] = { _errors: [] }
							}
							formatted['code']._errors.push(err.message)
						} else if (err.message.includes('deployedBytecode')) {
							if (!formatted['deployedBytecode']) {
								formatted['deployedBytecode'] = { _errors: [] }
							}
							formatted['deployedBytecode']._errors.push(err.message)
						} else if (err.message.includes('abi')) {
							if (!formatted['abi']) {
								formatted['abi'] = { _errors: [] }
							}
							formatted['abi']._errors.push(err.message)
						} else if (err.message.includes('args')) {
							if (!formatted['args']) {
								formatted['args'] = { _errors: [] }
							}
							formatted['args']._errors.push(err.message)
						} else if (err.message.includes('functionName')) {
							if (!formatted['functionName']) {
								formatted['functionName'] = { _errors: [] }
							}
							formatted['functionName']._errors.push(err.message)
						} else if (err.message.includes('to address')) {
							if (!formatted['to']) {
								formatted['to'] = { _errors: [] }
							}
							formatted['to']._errors.push(err.message)
						} else {
							formatted._errors.push(err.message)
						}
					})
					return formatted
				},
			},
		}
	},
}