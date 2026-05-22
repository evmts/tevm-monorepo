import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidGasRefundError.
 * @typedef {Object} InvalidGasRefundErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the gas refund is invalid.
 *
 * This error is typically encountered when a transaction or operation specifies an invalid gas refund value.
 *
 * @example
 * ```javascript
 * import { InvalidGasRefundError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     gasRefund: -1n, // Invalid negative gas refund
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidGasRefundError) {
 *     console.error('Invalid gas refund:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidGasRefundError extends InvalidParamsError {
	/**
	 * Constructs an InvalidGasRefundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidGasRefundErrorParameters} [args={}] - Additional parameters for the InvalidGasRefundError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidgasrefunderror/',
			},
			'InvalidGasRefundError',
		)

		this.name = 'InvalidGasRefundError'
		this._tag = 'InvalidGasRefundError'
	}
}
