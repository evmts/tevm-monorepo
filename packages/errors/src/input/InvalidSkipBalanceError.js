import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidSkipBalanceError.
 * @typedef {Object} InvalidSkipBalanceErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
