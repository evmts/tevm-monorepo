import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidAddToMempoolError.
 * @typedef {Object} InvalidAddToMempoolErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
