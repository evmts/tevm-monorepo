import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidSelfdestructError.
 * @typedef {Object} InvalidSelfdestructErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the selfdestruct parameter is invalid.
 *
 * This error is typically encountered when setting an account's selfdestruct status with an invalid value.
 *
 * @example
 * ```javascript
 * import { InvalidSelfdestructError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     selfdestruct: 'not_a_boolean', // Should be a boolean
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidSelfdestructError) {
 *     console.error('Invalid selfdestruct value:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidSelfdestructError extends InvalidParamsError {
	/**
	 * Constructs an InvalidSelfdestructError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidSelfdestructErrorParameters} [args={}] - Additional parameters for the InvalidSelfdestructError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidselfdestructerror/',
			},
			'InvalidSelfdestructError',
		)

		this.name = 'InvalidSelfdestructError'
		this._tag = 'InvalidSelfdestructError'
	}
}
