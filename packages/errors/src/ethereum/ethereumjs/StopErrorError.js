import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link StopError}.
 * @typedef {Object} StopErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents a contract/bytecode error that occurs when a STOP operation is executed.
 *
 * Stop errors can occur due to:
 * - The contract execution reaching a STOP opcode.
 *
 * To debug a stop error:
 * 1. **Review Contract Logic**: Ensure that the STOP opcode is used intentionally and correctly.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify the STOP operation.
 *
 * @example
 * ```typescript
 * import { StopError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a StopError
 * } catch (error) {
 *   if (error instanceof StopError) {
 *     console.error(error.message);
 *     // Handle the stop error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Stop error occurred.'] - A human-readable error message.
 * @param {StopErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'StopError'} _tag - Same as name, used internally.
 * @property {'StopError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class StopError extends ExecutionError {
	/** @type {string} */	static EVMErrorMessage = EVMError.errorMessages.STOP
	/**
	 * Constructs a StopError.
	 * Represents a contract/bytecode error that occurs when a STOP operation is executed.
	 *
	 * Stop errors can occur due to:
	 * - The contract execution reaching a STOP opcode.
	 *
	 * To debug a stop error:
	 * 1. **Review Contract Logic**: Ensure that the STOP opcode is used intentionally and correctly.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify the STOP operation.
	 *
	 * @param {string} [message='Stop error occurred.'] - Human-readable error message.
	 * @param {StopErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='StopError'] - The tag for the error.
	 *
	 */
	constructor(message = 'Stop error occurred.', args = {}, tag = 'StopError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/stoperror/',
			},
			tag,
		)
	}
}
