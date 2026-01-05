import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidReturnSubError}.
 * @typedef {Object} InvalidReturnSubErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid RETURNSUB operation is executed within the EVM.
 *
 * Invalid RETURNSUB errors can occur due to:
 * - Incorrect use of the RETURNSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine returns.
 *
 * To debug an invalid RETURNSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the RETURNSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid RETURNSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidReturnSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidReturnSubError
 * } catch (error) {
 *   if (error instanceof InvalidReturnSubError) {
 *     console.error(error.message);
 *     // Handle the invalid RETURNSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid RETURNSUB error occurred.'] - A human-readable error message.
 * @param {InvalidReturnSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidReturnSubError'} _tag - Same as name, used internally.
 * @property {'InvalidReturnSubError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidReturnSubError extends ExecutionError {
	// Note: INVALID_RETURNSUB was removed from ethereumjs
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.INVALID_RETURNSUB
	/**
	 * Constructs an InvalidReturnSubError.
	 * Represents an invalid bytecode/contract error that occurs when an invalid RETURNSUB operation is executed within the EVM.
	 *
	 * Invalid RETURNSUB errors can occur due to:
	 * - Incorrect use of the RETURNSUB opcode.
	 * - Bugs in the smart contract code causing invalid subroutine returns.
	 *
	 * To debug an invalid RETURNSUB error:
	 * 1. **Review Subroutine Logic**: Ensure that the RETURNSUB opcode is used correctly within subroutine definitions.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid RETURNSUB occurs.
	 *
	 * @param {string} [message='Invalid RETURNSUB error occurred.'] - Human-readable error message.
	 * @param {InvalidReturnSubErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidReturnSubError'] - The tag for the error.
	 */
	constructor(message = 'Invalid RETURNSUB error occurred.', args = {}, tag = 'InvalidReturnSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidreturnsuberror/',
			},
			tag,
		)
	}
}
