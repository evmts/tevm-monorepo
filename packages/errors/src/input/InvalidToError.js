import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidToError.
 * @typedef {Object} InvalidToErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
