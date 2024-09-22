import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidAbiError.
 * @typedef {Object} InvalidAbiErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the ABI is invalid.
 *
 * This error is typically encountered when a contract interaction or ABI-related operation receives an invalid or malformed ABI.
 *
 * @example
 * ```javascript
 * import { InvalidAbiError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.contract({
 *     abi: 'invalid_abi', // This should be a valid ABI array
 *     address: '0x...',
 *     functionName: 'someFunction',
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidAbiError) {
 *     console.error('Invalid ABI:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidAbiError extends InvalidParamsError {
	/**
	 * Constructs an InvalidAbiError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidAbiErrorParameters} [args={}] - Additional parameters for the InvalidAbiError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidabierror/',
			},
			'InvalidAbiError',
		)

		this.name = 'InvalidAbiError'
		this._tag = 'InvalidAbiError'
	}
}
