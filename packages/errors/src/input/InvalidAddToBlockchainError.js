import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidAddToBlockchainError.
 * @typedef {Object} InvalidAddToBlockchainErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the addToBlockchain parameter is invalid.
 *
 * This error is typically encountered when a transaction specifies an invalid addToBlockchain value.
 *
 * @example
 * ```javascript
 * import { InvalidAddToBlockchainError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.call({
 *     to: '0x0987654321098765432109876543210987654321',
 *     data: '0x',
 *     addToBlockchain: 'invalid', // Should be boolean
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidAddToBlockchainError) {
 *     console.error('Invalid addToBlockchain parameter:', error.message)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidAddToBlockchainError extends InvalidParamsError {
	/**
	 * Constructs an InvalidAddToBlockchainError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidAddToBlockchainErrorParameters} [args={}] - Additional parameters for the InvalidAddToBlockchainError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidaddtoblockchainerror/',
			},
			'InvalidAddToBlockchainError',
		)

		this.name = 'InvalidAddToBlockchainError'
		this._tag = 'InvalidAddToBlockchainError'
	}
}
