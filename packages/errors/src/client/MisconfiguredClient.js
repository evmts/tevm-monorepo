import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link MisconfiguredClientError}.
 * @typedef {Object} MisconfiguredClientErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the Client is misconfigured.
 *
 * Misconfigured memory client errors can occur due to:
 * - Incorrect configuration parameters provided when creating a Client.
 *
 * @example
 * ```typescript
 * import { MisconfiguredClientError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a MisconfiguredClientError
 * } catch (error) {
 *   if (error instanceof MisconfiguredClientError) {
 *     console.error(error.message);
 *     // Handle the misconfigured memory client error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Misconfigured memory client error occurred.'] - A human-readable error message.
 * @param {MisconfiguredClientErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'MisconfiguredClientError'} _tag - Same as name, used internally.
 * @property {'MisconfiguredClientError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class MisconfiguredClientError extends InternalError {
	/**
	 * Constructs a MisconfiguredClientError.
	 *
	 * @param {string} [message='Misconfigured memory client error occurred.'] - Human-readable error message.
	 * @param {MisconfiguredClientErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='MisconfiguredClientError'] - The tag for the error.
	 */
	constructor(message = 'Misconfigured memory client error occurred.', args = {}, tag = 'MisconfiguredClientError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/misconfiguredmemoryclienterror/',
			},
			tag,
		)
	}
}
