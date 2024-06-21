import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link DefensiveNullCheckError}.
 * @typedef {Object} DefensiveNullCheckErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a defensive null check is tripped.
 * This error should never be thrown and indicates a bug in the Tevm VM if it is Thrown
 *
 * Defensive null check errors can occur due to:
 * - Checking what should be an impossible null value, indicating a bug in TEVM.
 *
 * To handle this error take the following steps:
 * - ensure you did not modify the tevm VM in any unsupported way.
 * - Open an issue with a minimal reproducable example
 *
 * @example
 * ```typescript
 * import { DefensiveNullCheckError } from '@tevm/errors'
 * function assertNotNull<T>(value: T | null): T {
 *   const name = 'bob'
 *   const firstLetter = name[0]
 *   if (firstLetter === undefined) {
 *     throw new DefensiveNullCheckError('Null value encountered in assertNotNull')
 *   }
 *   return value
 * }
 * ```
 *
 * @param {string} [message='Defensive null check error occurred.'] - A human-readable error message.
 * @param {DefensiveNullCheckErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'DefensiveNullCheckError'} _tag - Same as name, used internally.
 * @property {'DefensiveNullCheckError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class DefensiveNullCheckError extends InternalError {
	/**
	 * Constructs a DefensiveNullCheckError.
	 *
	 * @param {string} [message='Defensive null check error occurred.'] - Human-readable error message.
	 * @param {DefensiveNullCheckErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='DefensiveNullCheckError'] - The tag for the error.
	 */
	constructor(message = 'Defensive null check error occurred.', args = {}, tag = 'DefensiveNullCheckError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/defensivenullcheckerror/',
			},
			tag,
		)
	}
}
