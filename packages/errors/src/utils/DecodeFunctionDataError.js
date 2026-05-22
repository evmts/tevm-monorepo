import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing a DecodeFunctionDataError.
 * @typedef {Object} DecodeFunctionDataErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
