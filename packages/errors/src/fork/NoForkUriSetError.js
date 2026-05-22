import { BaseError } from '../ethereum/BaseError.js'

/**
 * Parameters for constructing a NoForkTransportSetError.
 * @typedef {Object} NoForkTransportSetErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Error represents the tevm client attempted to fetch a resource from a Forked transport but no transport was set.
 *
 * @example
 * ```javascript
 * import { NoForkTransportSetError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient() // No fork configuration
 *
 * try {
 *   await client.getBalance('0x...') // This might throw if it needs to access forked state
 * } catch (error) {
 *   if (error instanceof NoForkTransportSetError) {
 *     console.error('No fork transport set:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *     // Handle the error, e.g., by setting up a fork configuration
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class NoForkTransportSetError extends BaseError {
	/**
	 * Constructs a NoForkTransportSetError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NoForkTransportSetErrorParameters} [args] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/noforktransportseterror/',
			},
			'NoForkTransportSetError',
		)

		this.name = 'NoForkTransportSetError'
		this._tag = 'NoForkTransportSetError'
	}
}
