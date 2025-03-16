import {
	InvalidAbiError,
	InvalidAddressError,
	InvalidArgsError,
	InvalidBytecodeError,
	InvalidFunctionNameError,
	InvalidParamsError,
} from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateAbi } from '../internal/validators/validateAbi.js'
import { validateAddress } from '../internal/validators/validateAddress.js'
import { validateHex } from '../internal/validators/validateHex.js'

/**
 * Performs direct validation of contract parameters
 * @param {import('./ContractParams.js').ContractParams} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{ message: string }>}} - Validation result
 */
const validateContract = (params) => {
	if (typeof params !== 'object' || params === null) {
		return {
			isValid: false,
			errors: [{ message: 'Parameters must be an object' }],
		}
	}

	const errors = []

	// Validate abi (required)
	if (!('abi' in params) || params.abi === undefined) {
		errors.push({ message: 'Missing required field: abi' })
	} else {
		const abiValidation = validateAbi(params.abi)
		if (!abiValidation.isValid) {
			errors.push({ message: abiValidation.message || 'Invalid ABI' })
		}
	}

	// Validate functionName (required)
	if (!('functionName' in params) || params.functionName === undefined) {
		errors.push({ message: 'Missing required field: functionName' })
	} else if (typeof params.functionName !== 'string') {
		errors.push({ message: 'functionName must be a string' })
	}

	// Validate args if present
	if ('args' in params && params.args !== undefined) {
		if (!Array.isArray(params.args)) {
			errors.push({ message: 'args must be an array' })
		}
	}

	// Validate to if present
	if ('to' in params && params.to !== undefined) {
		const toValidation = validateAddress(params.to)
		if (!toValidation.isValid) {
			errors.push({ message: toValidation.message || 'Invalid to address' })
		}
	}

	// Validate code if present
	if ('code' in params && params.code !== undefined) {
		const codeValidation = validateHex(params.code)
		if (!codeValidation.isValid) {
			errors.push({ message: codeValidation.message || 'Invalid code' })
		}
	}

	// Validate deployedBytecode if present
	if ('deployedBytecode' in params && params.deployedBytecode !== undefined) {
		const bytecodeValidation = validateHex(params.deployedBytecode)
		if (!bytecodeValidation.isValid) {
			errors.push({ message: bytecodeValidation.message || 'Invalid deployedBytecode' })
		}
	}

	// Validate must have either code, to, or deployedBytecode
	if (!params.code && !params.to && !params.deployedBytecode) {
		errors.push({ message: 'Must have either code, to, or deployedBytecode' })
	}

	// Validate cannot have stateOverrideSet or blockOverrideSet for createTransaction
	if (params.createTransaction) {
		if (params.stateOverrideSet) {
			errors.push({ message: 'Cannot have stateOverrideSet for createTransaction' })
		}
		if (params.blockOverrideSet) {
			errors.push({ message: 'Cannot have blockOverrideSet for createTransaction' })
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * @typedef {InvalidAbiError| InvalidAddressError| InvalidArgsError| InvalidFunctionNameError | InvalidBytecodeError | import('../BaseCall/validateBaseCallParams.js').ValidateBaseCallParamsError} ValidateContractParamsError
 */

/**
 * @param {import('./ContractParams.js').ContractParams} action
 * @returns {Array<ValidateContractParamsError>}
 */
export const validateContractParams = (action) => {
	/**
	 * @type {Array<ValidateContractParamsError>}
	 */
	const errors = validateBaseCallParams(action)

	// Do direct validation instead of relying on the zContractParams
	const validation = validateContract(action)

	if (!validation.isValid) {
		validation.errors.forEach((error) => {
			const errorMessage = error.message || 'Invalid parameter'

			// Add appropriate error types based on the error message
			if (errorMessage.includes('code') || errorMessage.includes('deployedBytecode') || errorMessage.includes('Must have either code')) {
				errors.push(new InvalidBytecodeError(errorMessage))
			} else if (errorMessage.includes('abi')) {
				errors.push(new InvalidAbiError(errorMessage))
			} else if (errorMessage.includes('args')) {
				errors.push(new InvalidArgsError(errorMessage))
			} else if (errorMessage.includes('functionName')) {
				errors.push(new InvalidFunctionNameError(errorMessage))
			} else if (errorMessage.includes('to address') || (errorMessage.includes('to') && errorMessage.includes('a hex string'))) {
				errors.push(new InvalidAddressError(errorMessage))
			} else {
				errors.push(new InvalidParamsError(errorMessage))
			}
		})
	}

	// Mandatory validation for must have code, to, or deployedBytecode
	if (typeof action === 'object' && action !== null) {
		if (!action.code && !action.to && !action.deployedBytecode) {
			errors.push(new InvalidBytecodeError('Must have either code, to, or deployedBytecode'))
		}
		
		// ABI validation
		if (action.abi !== undefined && !Array.isArray(action.abi)) {
			errors.push(new InvalidAbiError('ABI must be an array'))
		}
		
		// Function name validation
		if (action.functionName !== undefined && typeof action.functionName !== 'string') {
			errors.push(new InvalidFunctionNameError('functionName must be a string'))
		}
		
		// Args validation
		if (action.args !== undefined && !Array.isArray(action.args)) {
			errors.push(new InvalidArgsError('args must be an array'))
		}
	}

	return errors
}
