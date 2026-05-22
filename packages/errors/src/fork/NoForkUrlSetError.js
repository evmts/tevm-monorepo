import { BaseError } from '../ethereum/BaseError.js'

/**
 * Parameters for constructing a NoForkUrlSetError.
 * @typedef {Object} NoForkUrlSetErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Error represents the tevm client attempted to fetch a resource from a Forked transport but no fork url was set in the transport.
 *
 * @example
 * ```javascript
 * import { NoForkUrlSetError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient() // No fork configuration
 *
 * try {
 *   await client.getBalance('0x...') // This might throw if it needs to access forked state
 * } catch (error) {
 *   if (error instanceof NoForkUrlSetError) {
 *     console.error('No fork url set:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *     // Handle the error, e.g., by setting up a fork configuration
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class NoForkUrlSetError extends BaseError {
	/**
	 * Constructs a NoForkUrlSetError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NoForkUrlSetErrorParameters} [args] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/noforkurlseterror/',
			},
			'NoForkUrlSetError',
		)

		this.name = 'NoForkUrlSetError'
		this._tag = 'NoForkUrlSetError'
	}
}
