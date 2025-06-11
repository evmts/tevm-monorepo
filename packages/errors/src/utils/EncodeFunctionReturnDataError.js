import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an EncodeFunctionReturnDataError.
 * @typedef {Object} EncodeFunctionReturnDataErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when encoding function return data fails.
 * Not expected to be thrown because the initial validation
 * should have caught any errors and thrown more specific errors.
 *
 * @example
 * ```javascript
 * import { EncodeFunctionReturnDataError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   const result = await client.contract({
 *     address: '0x1234567890123456789012345678901234567890',
 *     abi: [...],
 *     functionName: 'someFunction',
 *   })
 *   // Assume some internal error occurs during encoding of the return data
 * } catch (error) {
 *   if (error instanceof EncodeFunctionReturnDataError) {
 *     console.error('Encode function return data error:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class EncodeFunctionReturnDataError extends InvalidParamsError {
	/**
	 * Constructs an EncodeFunctionReturnDataError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {EncodeFunctionReturnDataErrorParameters} [args={}] - Additional parameters for the EncodeFunctionReturnDataError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/encodefunctionreturndataerror/',
			},
			'EncodeFunctionReturnDataError',
		)
	}

	/**
	 * @type {'EncodeFunctionReturnDataError'}
	 * @override
	 */
	_tag = 'EncodeFunctionReturnDataError'

	/**
	 * @type {'EncodeFunctionReturnDataError'}
	 * @override
	 */
	name = 'EncodeFunctionReturnDataError'
}
