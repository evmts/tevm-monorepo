import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBalanceError.
 * @typedef {Object} InvalidBalanceErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when an account balance is invalid.
 *
 * This error is typically encountered when setting or manipulating account balances with invalid values.
 *
 * @example
 * ```javascript
 * import { InvalidBalanceError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x...',
 *     balance: -1000n, // Invalid negative balance
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidBalanceError) {
 *     console.error('Invalid balance:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidBalanceError extends InvalidParamsError {
	/**
	 * Constructs an InvalidBalanceError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidBalanceErrorParameters} [args={}] - Additional parameters for the InvalidBalanceError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbalanceerror/',
			},
			'InvalidBalanceError',
		)

		this.name = 'InvalidBalanceError'
		this._tag = 'InvalidBalanceError'
	}
}
