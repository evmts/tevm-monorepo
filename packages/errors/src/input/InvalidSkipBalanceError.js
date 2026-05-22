import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidSkipBalanceError.
 * @typedef {Object} InvalidSkipBalanceErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the skipBalance parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation uses an invalid skipBalance value.
 *
 * @example
 * ```javascript
 * import { InvalidSkipBalanceError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x...',
 *     skipBalance: 'invalid', // This should be a boolean
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidSkipBalanceError) {
 *     console.error('Invalid skipBalance:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidSkipBalanceError extends InvalidParamsError {
	/**
	 * Constructs an InvalidSkipBalanceError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidSkipBalanceErrorParameters} [args={}] - Additional parameters for the InvalidSkipBalanceError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidskipbalanceerror/',
			},
			'InvalidSkipBalanceError',
		)

		this.name = 'InvalidSkipBalanceError'
		this._tag = 'InvalidSkipBalanceError'
	}
}
