import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidJumpSubError}.
 * @typedef {Object} InvalidJumpSubErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.
 *
 * Invalid JUMPSUB errors can occur due to:
 * - Incorrect use of the JUMPSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine jumps.
 *
 * To debug an invalid JUMPSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidJumpSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidJumpSubError
 * } catch (error) {
 *   if (error instanceof InvalidJumpSubError) {
 *     console.error(error.message);
 *     // Handle the invalid JUMPSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid JUMPSUB error occurred.'] - A human-readable error message.
 * @param {InvalidJumpSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidJumpSubError'} _tag - Same as name, used internally.
 * @property {'InvalidJumpSubError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidJumpSubError extends ExecutionError {
	// Note: INVALID_JUMPSUB was removed from ethereumjs
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.INVALID_JUMPSUB
	/**
	 * Constructs an InvalidJumpSubError.
	 * Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.
	 *
	 * Invalid JUMPSUB errors can occur due to:
	 * - Incorrect use of the JUMPSUB opcode.
	 * - Bugs in the smart contract code causing invalid subroutine jumps.
	 *
	 * To debug an invalid JUMPSUB error:
	 * 1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.
	 *
	 * @param {string} [message='Invalid JUMPSUB error occurred.'] - Human-readable error message.
	 * @param {InvalidJumpSubErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidJumpSubError'] - The tag for the error.}
	 *
	 * @example
	 * ```typescript
	 * import { InvalidJumpSubError } from '@tevm/errors'
	 * try {
	 *   // Some operation that can throw an InvalidJumpSubError
	 * } catch (error) {
	 *   if (error instanceof InvalidJumpSubError) {
	 *     console.error(error.message);
	 *     // Handle the invalid JUMPSUB error
	 *   }
	 * }
	 * ```
	 */
	constructor(message = 'Invalid JUMPSUB error occurred.', args = {}, tag = 'InvalidJumpSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidjumpsuberror/',
			},
			tag,
		)
	}
}
