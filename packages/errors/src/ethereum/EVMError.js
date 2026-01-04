/**
 * Native EVM error class replacing @ethereumjs/evm EVMError.
 * This provides the same API as the ethereumjs EVMError for compatibility.
 */

/**
 * Error type string constant for EVMError identification
 * @type {string}
 */
export const EVMErrorTypeString = 'EVMError'

/**
 * Mapping of EVM error types to their human-readable messages
 * @type {Record<string, string>}
 */
export const EVMErrorMessage = /** @type {const} */ ({
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
	// Additional EVM error types that may be used
	AUTHCALL_UNSET: 'auth call unset',
	INVALID_RETURNSUB: 'invalid RETURNSUB',
	INVALID_JUMPSUB: 'invalid JUMPSUB',
	INVALID_BEGINSUB: 'invalid BEGINSUB',
	INVALID_KZG_INPUTS: 'invalid KZG inputs',
})

/**
 * EVM error class that represents errors during EVM execution.
 * Provides compatibility with @ethereumjs/evm EVMError API.
 *
 * @example
 * ```javascript
 * import { EVMError, EVMErrorMessage } from '@tevm/errors'
 *
 * const error = new EVMError('OUT_OF_GAS')
 * console.log(error.error) // 'OUT_OF_GAS'
 * console.log(error.errorType) // 'EVMError'
 * console.log(EVMError.errorMessages.OUT_OF_GAS) // 'out of gas'
 * ```
 */
export class EVMError {
	/**
	 * The error code/type string
	 * @type {string}
	 */
	error

	/**
	 * Constant string identifying this as an EVMError
	 * @type {string}
	 */
	errorType = EVMErrorTypeString

	/**
	 * Static mapping of error codes to their messages for compatibility
	 * with @ethereumjs/evm EVMError.errorMessages API
	 * @type {typeof EVMErrorMessage}
	 */
	static errorMessages = EVMErrorMessage

	/**
	 * Creates a new EVMError instance.
	 * @param {string} error - The error code/type (e.g., 'OUT_OF_GAS', 'REVERT')
	 */
	constructor(error) {
		this.error = error
	}
}
