import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidFunctionNameError.
 * @typedef {Object} InvalidFunctionNameErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the function name is invalid.
 *
 * This error is typically encountered when trying to call a contract function with an invalid or non-existent function name.
 *
 * @example
 * ```javascript
 * import { InvalidFunctionNameError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.contract({
 *     address: '0x1234567890123456789012345678901234567890',
 *     abi: [...],
 *     functionName: 'nonExistentFunction',
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidFunctionNameError) {
 *     console.error('Invalid function name:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidFunctionNameError extends InvalidParamsError {
	/**
	 * Constructs an InvalidFunctionNameError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidFunctionNameErrorParameters} [args={}] - Additional parameters for the InvalidFunctionNameError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidfunctionnameerror/',
			},
			'InvalidFunctionNameError'
		)

		this.name = 'InvalidFunctionNameError'
		this._tag = 'InvalidFunctionNameError'
	}
}
