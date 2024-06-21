import { ExecutionError } from '../ethereum/ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link CommonMismatchError}.
 * @typedef {Object} CommonMismatchErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the Common for a given block does not match the Common of the VM.
 *
 * Common mismatch errors can occur due to:
 * - Discrepancies between the Common configurations for a block and the VM.
 *
 * @example
 * ```typescript
 * import { CommonMismatchError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a CommonMismatchError
 * } catch (error) {
 *   if (error instanceof CommonMismatchError) {
 *     console.error(error.message);
 *     // Handle the common mismatch error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Common mismatch error occurred.'] - A human-readable error message.
 * @param {CommonMismatchErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'CommonMismatchError'} _tag - Same as name, used internally.
 * @property {'CommonMismatchError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class CommonMismatchError extends ExecutionError {
	/**
	 * Constructs a CommonMismatchError.
	 *
	 * @param {string} [message='Common mismatch error occurred.'] - Human-readable error message.
	 * @param {CommonMismatchErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='CommonMismatchError'] - The tag for the error.
	 */
	constructor(message = 'Common mismatch error occurred.', args = {}, tag = 'CommonMismatchError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/commonmismatcherror/',
			},
			tag,
		)
	}
}
