import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing a DecodeFunctionDataError.
 * @typedef {Object} DecodeFunctionDataErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when decoding function data fails.
 * Not expected to be thrown unless ABI is incorrect.
 *
 * @example
 * ```javascript
 * import { DecodeFunctionDataError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   const result = await client.call({
 *     to: '0x1234567890123456789012345678901234567890',
 *     data: '0x...' // Invalid or mismatched function data
 *   })
 * } catch (error) {
 *   if (error instanceof DecodeFunctionDataError) {
 *     console.error('Decode function data error:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class DecodeFunctionDataError extends InvalidParamsError {
	/**
	 * Constructs a DecodeFunctionDataError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {DecodeFunctionDataErrorParameters} [args={}] - Additional parameters for the DecodeFunctionDataError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/decodefunctiondataerror/',
			},
			'DecodeFunctionDataError',
		)

		this.name = 'DecodeFunctionDataError'
		this._tag = 'DecodeFunctionDataError'
	}
}
