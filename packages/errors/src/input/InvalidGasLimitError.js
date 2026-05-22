import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidGasLimitError.
 * @typedef {Object} InvalidGasLimitErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the gas limit is invalid.
 *
 * This error is typically encountered when a transaction or operation specifies an invalid gas limit.
 *
 * @example
 * ```javascript
 * import { InvalidGasLimitError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     gasLimit: -1n, // Invalid negative gas limit
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidGasLimitError) {
 *     console.error('Invalid gas limit:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidGasLimitError extends InvalidParamsError {
	/**
	 * Constructs an InvalidGasLimitError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidGasLimitErrorParameters} [args={}] - Additional parameters for the InvalidGasLimitError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidgaslimiterror/',
			},
			'InvalidGasLimitError',
		)

		this.name = 'InvalidGasLimitError'
		this._tag = 'InvalidGasLimitError'
	}
}
