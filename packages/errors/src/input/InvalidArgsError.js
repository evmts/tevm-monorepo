import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidArgsError.
 * @typedef {Object} InvalidArgsErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the arguments provided to a function or method are invalid.
 *
 * This error is typically encountered when a function receives arguments that don't match the expected types or format.
 *
 * @example
 * ```javascript
 * import { InvalidArgsError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.contract({
 *     address: '0x...',
 *     functionName: 'transfer',
 *     args: ['not_an_address', 'not_a_number'], // Invalid args
 *     abi: [...],
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidArgsError) {
 *     console.error('Invalid arguments:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidArgsError extends InvalidParamsError {
	/**
	 * Constructs an InvalidArgsError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidArgsErrorParameters} [args={}] - Additional parameters for the InvalidArgsError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidargserror/',
			},
			'InvalidArgsError',
		)

		this.name = 'InvalidArgsError'
		this._tag = 'InvalidArgsError'
	}
}
