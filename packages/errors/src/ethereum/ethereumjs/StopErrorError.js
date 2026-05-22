import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link StopError}.
 * @typedef {Object} StopErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class StopError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STOP
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {StopErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
