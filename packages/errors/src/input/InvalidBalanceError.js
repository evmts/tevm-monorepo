import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBalanceError.
 * @typedef {Object} InvalidBalanceErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
			'InvalidBalanceError'
		)

		this.name = 'InvalidBalanceError'
		this._tag = 'InvalidBalanceError'
	}
}
