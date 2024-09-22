import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidUrlError.
 * @typedef {Object} InvalidUrlErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a URL is invalid.
 *
 * This error is typically encountered when an operation requires a valid URL, but receives an invalid one.
 *
 * @example
 * ```javascript
 * import { InvalidUrlError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * try {
 *   const client = createMemoryClient({
 *     fork: {
 *       url: 'not_a_valid_url'
 *     }
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidUrlError) {
 *     console.error('Invalid URL:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidUrlError extends InvalidParamsError {
	/**
	 * Constructs an InvalidUrlError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidUrlErrorParameters} [args={}] - Additional parameters for the InvalidUrlError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidurlerror/',
			},
			'InvalidUrlError',
		)

		this.name = 'InvalidUrlError'
		this._tag = 'InvalidUrlError'
	}
}
