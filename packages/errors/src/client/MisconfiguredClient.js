import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link MisconfiguredClientError}.
 * @typedef {Object} MisconfiguredClientErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('../ethereum/EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the Client is misconfigured.
 *
 * This error can be thrown when:
 * - Incorrect configuration parameters are provided when creating a Client.
 * - The Client is used in a way that's incompatible with its configuration.
 *
 * @example
 * ```typescript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { MisconfiguredClientError } from '@tevm/errors'
 *
 * const memoryClient = createMemoryClient({
 *   // Assume we've misconfigured something here
 * })
 *
 * try {
 *   await memoryClient.tevmCall({
 *     to: '0x...',
 *     data: '0x...',
 *   })
 * } catch (error) {
 *   if (error instanceof MisconfiguredClientError) {
 *     console.error('Client misconfiguration:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *     // Attempt to recreate the client with correct configuration
 *     // or notify the user to check their client setup
 *   }
 * }
 * ```
 *
 * @extends {InternalError}
 */
export class MisconfiguredClientError extends InternalError {
	/**
	 * Constructs a MisconfiguredClientError.
	 *
	 * @param {string} [message='Misconfigured client error occurred.'] - Human-readable error message.
	 * @param {MisconfiguredClientErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message = 'Misconfigured client error occurred.', args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/misconfiguredclienterror/',
			},
			'MisconfiguredClientError',
		)

		/**
		 * @type {'MisconfiguredClientError'}
		 */
		this.name = 'MisconfiguredClientError'

		/**
		 * @type {'MisconfiguredClientError'}
		 */
		this._tag = 'MisconfiguredClientError'
	}
}
