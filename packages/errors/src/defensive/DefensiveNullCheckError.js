import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link DefensiveNullCheckError}.
 * @typedef {Object} DefensiveNullCheckErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('../ethereum/EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a defensive null check is tripped.
 * This error should never be thrown and indicates a bug in the Tevm VM if it is thrown.
 *
 * @example
 * ```javascript
 * import { DefensiveNullCheckError } from '@tevm/errors'
 *
 * function assertNotNull(value, message) {
 *   if (value === null || value === undefined) {
 *     throw new DefensiveNullCheckError(message)
 *   }
 *   return value
 * }
 *
 * try {
 *   const result = someFunction()
 *   assertNotNull(result, 'Result should not be null')
 * } catch (error) {
 *   if (error instanceof DefensiveNullCheckError) {
 *     console.error('Unexpected null value:', error.message)
 *     // This indicates a bug in the Tevm VM
 *     reportBugToTevmRepository(error)
 *   }
 * }
 * ```
 *
 * @extends {InternalError}
 */
export class DefensiveNullCheckError extends InternalError {
	/**
	 * Constructs a DefensiveNullCheckError.
	 *
	 * @param {string} [message] - Human-readable error message.
	 * @param {DefensiveNullCheckErrorParameters} [args] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(
			message || 'Defensive null check error occurred.',
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/defensivenullcheckerror/',
			},
			'DefensiveNullCheckError',
		)

		this.name = 'DefensiveNullCheckError'
		this._tag = 'DefensiveNullCheckError'
	}
}
