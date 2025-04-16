import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidAddToMempoolError.
 * @typedef {Object} InvalidAddToMempoolErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the addToMempool parameter is invalid.
 *
 * This error is typically encountered when a transaction specifies an invalid addToMempool value.
 *
 * @example
 * ```javascript
 * import { InvalidAddToMempoolError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.call({
 *     to: '0x0987654321098765432109876543210987654321',
 *     data: '0x',
 *     addToMempool: 'invalid', // Should be boolean
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidAddToMempoolError) {
 *     console.error('Invalid addToMempool parameter:', error.message)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidAddToMempoolError extends InvalidParamsError {
	/**
	 * Constructs an InvalidAddToMempoolError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidAddToMempoolErrorParameters} [args={}] - Additional parameters for the InvalidAddToMempoolError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidaddtomempoolerror/',
			},
			'InvalidAddToMempoolError',
		)

		this.name = 'InvalidAddToMempoolError'
		this._tag = 'InvalidAddToMempoolError'
	}
}
