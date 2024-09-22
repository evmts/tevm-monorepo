import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidArgsError.
 * @typedef {Object} InvalidArgsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
			'InvalidArgsError'
		)

		this.name = 'InvalidArgsError'
		this._tag = 'InvalidArgsError'
	}
}
