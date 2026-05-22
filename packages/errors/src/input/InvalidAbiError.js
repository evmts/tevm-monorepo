import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidAbiError.
 * @typedef {Object} InvalidAbiErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
