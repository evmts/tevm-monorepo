import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidToError.
 * @typedef {Object} InvalidToErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the 'to' address in a transaction or operation is invalid.
 *
 * This error is typically encountered when a transaction or contract interaction specifies an invalid recipient address.
 *
 * @example
 * ```javascript
 * import { InvalidToError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: 'invalid_address', // Invalid 'to' address
 *     value: 1000n,
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidToError) {
 *     console.error('Invalid to address:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidToError extends InvalidParamsError {
	/**
	 * Constructs an InvalidToError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidToErrorParameters} [args={}] - Additional parameters for the InvalidToError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidtoerror/',
			},
			'InvalidToError',
		)

		this.name = 'InvalidToError'
		this._tag = 'InvalidToError'
	}
}
