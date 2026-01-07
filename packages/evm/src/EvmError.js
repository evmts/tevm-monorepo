/**
 * Native EVM error class (migrated from @ethereumjs/evm)
 * Used for representing EVM execution errors.
 *
 * @module EvmError
 */

/**
 * Type string identifier for EVM errors
 * @type {string}
 */
export const EVMErrorTypeString = 'EVMError'

/**
 * Standard EVM error messages
 * @type {Record<string, string>}
 */
export const EVMErrorMessage = {
	OUT_OF_GAS: 'out of gas',
	CODESTORE_OUT_OF_GAS: 'code store out of gas',
	CODESIZE_EXCEEDS_MAXIMUM: 'code size to deposit exceeds maximum code size',
	STACK_UNDERFLOW: 'stack underflow',
	STACK_OVERFLOW: 'stack overflow',
	INVALID_JUMP: 'invalid JUMP',
	INVALID_OPCODE: 'invalid opcode',
	OUT_OF_RANGE: 'value out of range',
	REVERT: 'revert',
	STATIC_STATE_CHANGE: 'static state change',
	INTERNAL_ERROR: 'internal error',
	CREATE_COLLISION: 'create collision',
	STOP: 'stop',
	REFUND_EXHAUSTED: 'refund exhausted',
	VALUE_OVERFLOW: 'value overflow',
	INSUFFICIENT_BALANCE: 'insufficient balance',
	INVALID_BYTECODE_RESULT: 'invalid bytecode deployed',
	INITCODE_SIZE_VIOLATION: 'initcode exceeds max initcode size',
	INVALID_INPUT_LENGTH: 'invalid input length',
	INVALID_EOF_FORMAT: 'invalid EOF format',
	BLS_12_381_INVALID_INPUT_LENGTH: 'invalid input length',
	BLS_12_381_POINT_NOT_ON_CURVE: 'point not on curve',
	BLS_12_381_INPUT_EMPTY: 'input is empty',
	BLS_12_381_FP_NOT_IN_FIELD: 'fp point not in field',
	BN254_FP_NOT_IN_FIELD: 'fp point not in field',
	INVALID_COMMITMENT: 'kzg commitment does not match versioned hash',
	INVALID_INPUTS: 'kzg inputs invalid',
	INVALID_PROOF: 'kzg proof invalid',
}

/**
 * Represents an EVM execution error.
 * This is a native implementation matching @ethereumjs/evm's EVMError interface.
 *
 * @example
 * ```javascript
 * import { EvmError, EVMErrorMessage } from '@tevm/evm'
 *
 * const error = new EvmError(EVMErrorMessage.REVERT)
 * console.log(error.error) // 'revert'
 * console.log(error.errorType) // 'EVMError'
 * ```
 */
export class EvmError {
	/**
	 * The error message string
	 * @type {string}
	 */
	error

	/**
	 * Type identifier for the error
	 * @type {string}
	 */
	errorType

	/**
	 * Static reference to all standard error messages
	 * @type {typeof EVMErrorMessage}
	 */
	static errorMessages = EVMErrorMessage

	/**
	 * Creates a new EvmError instance
	 * @param {string} error - The error message (typically from EVMErrorMessage)
	 */
	constructor(error) {
		this.error = error
		this.errorType = EVMErrorTypeString
	}
}
