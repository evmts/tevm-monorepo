import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidBeginSubError}.
 * @typedef {Object} InvalidBeginSubErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid BEGINSUB operation is executed within the EVM.
 *
 * Invalid BEGINSUB errors can occur due to:
 * - Incorrect use of the BEGINSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine execution.
 *
 * To debug an invalid BEGINSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the BEGINSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid BEGINSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidBeginSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidBeginSubError
 * } catch (error) {
 *   if (error instanceof InvalidBeginSubError) {
 *     console.error(error.message);
 *     // Handle the invalid BEGINSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid BEGINSUB error occurred.'] - A human-readable error message.
 * @param {InvalidBeginSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidBeginSubError'} _tag - Same as name, used internally.
 * @property {'InvalidBeginSubError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidBeginSubError extends ExecutionError {
	// Note: INVALID_BEGINSUB was removed from ethereumjs
	/** @type {string} */ // static EVMErrorMessage = EvmError.errorMessages.INVALID_BEGINSUB
	/**
	 * Constructs an InvalidBeginSubError.
	 * Represents an invalid bytecode/contract error that occurs when an invalid BEGINSUB operation is executed within the EVM.
	 *
	 * Invalid BEGINSUB errors can occur due to:
	 * - Incorrect use of the BEGINSUB opcode.
	 * - Bugs in the smart contract code causing invalid subroutine execution.
	 *
	 * To debug an invalid BEGINSUB error:
	 * 1. **Review Subroutine Logic**: Ensure that the BEGINSUB opcode is used correctly within subroutine definitions.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid BEGINSUB occurs.
	 *
	 * @param {string} [message='Invalid BEGINSUB error occurred.'] - Human-readable error message.
	 * @param {InvalidBeginSubErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidBeginSubError'] - The tag for the error.
	 */
	constructor(message = 'Invalid BEGINSUB error occurred.', args = {}, tag = 'InvalidBeginSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbeginsuberror/',
			},
			tag,
		)
	}
}
