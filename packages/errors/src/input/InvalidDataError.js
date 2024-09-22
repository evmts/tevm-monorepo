import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidDataError.
 * @typedef {Object} InvalidDataErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the data provided is invalid.
 *
 * This error is typically encountered when an operation receives invalid or malformed data.
 *
 * @example
 * ```javascript
 * import { InvalidDataError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     data: 'not_valid_hex_data', // Should be a valid hex string
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidDataError) {
 *     console.error('Invalid data:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidDataError extends InvalidParamsError {
	/**
	 * Constructs an InvalidDataError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidDataErrorParameters} [args={}] - Additional parameters for the InvalidDataError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invaliddataerror/',
			},
			'InvalidDataError',
		)

		this.name = 'InvalidDataError'
		this._tag = 'InvalidDataError'
	}
}
