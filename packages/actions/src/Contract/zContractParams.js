import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateAbi } from '../internal/validators/validateAbi.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateHex } from '../internal/validators/validateHex.js'

/**
 * Validates contract parameters
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<Error> }} - Validation result
 */
const validateContractParamsInternal = (value) => {
	// First get base call params validation errors
	const baseErrors = validateBaseCallParams(value)

	if (typeof value !== 'object' || value === null) {
		return {
			isValid: false,
			errors: [new Error('Parameters must be an object')],
		}
	}

	const errors = [...baseErrors]

	// Validate abi (required)
	if (!('abi' in value) || value.abi === undefined) {
		errors.push(new Error('Missing required field: abi'))
	} else {
		const abiValidation = validateAbi(value.abi)
		if (!abiValidation.isValid) {
			errors.push(new Error(abiValidation.message || 'Invalid ABI'))
		}
	}

	// Validate functionName (required)
	if (!('functionName' in value) || value.functionName === undefined) {
		errors.push(new Error('Missing required field: functionName'))
	} else if (typeof value.functionName !== 'string') {
		errors.push(new Error('functionName must be a string'))
	}

	// Validate args if present
	if ('args' in value && value.args !== undefined) {
		if (!Array.isArray(value.args)) {
			errors.push(new Error('args must be an array'))
		}
	}

	// Validate to if present
	if ('to' in value && value.to !== undefined) {
		const toValidation = validateAddress(value.to)
		if (!toValidation.isValid) {
			errors.push(new Error(toValidation.message || 'Invalid to address'))
		}
	}

	// Validate code if present
	if ('code' in value && value.code !== undefined) {
		const codeValidation = validateHex(value.code)
		if (!codeValidation.isValid) {
			errors.push(new Error(codeValidation.message || 'Invalid code'))
		}
	}

	// Validate deployedBytecode if present
	if ('deployedBytecode' in value && value.deployedBytecode !== undefined) {
		const bytecodeValidation = validateHex(value.deployedBytecode)
		if (!bytecodeValidation.isValid) {
			errors.push(new Error(bytecodeValidation.message || 'Invalid deployedBytecode'))
		}
	}

	// Validate must have either code, to, or deployedBytecode
	if (!value.code && !value.to && !value.deployedBytecode) {
		errors.push(new Error('Must have either code, to, or deployedBytecode'))
	}

	// Validate cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if (value.createTransaction) {
		if (value.stateOverrideSet) {
			errors.push(new Error('Cannot have stateOverrideSet for createTransaction'))
		}
		if (value.blockOverrideSet) {
			errors.push(new Error('Cannot have blockOverrideSet for createTransaction'))
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
 *   safeParse: (value: any) => {success: boolean, data: any} | {success: boolean, error: {format: () => {_errors: string[], [key: string]: {_errors: string[]}}}}
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
			throw new Error(validation.errors[0]?.message || 'Invalid contract parameters')
		}
		return value
	},
	/**
	 * @param {any} value
	 * @returns {{success: boolean, data: any} | {success: boolean, error: {format: () => {_errors: string[], [key: string]: {_errors: string[]}}}}}
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
					/** @type {{_errors: string[], [key: string]: {_errors: string[]}}} */
					const formatted = { _errors: [] }
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
