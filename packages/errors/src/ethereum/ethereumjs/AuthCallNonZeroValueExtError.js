import { EVMErrorMessage } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link AuthCallNonZeroValueExtError}.
 * @typedef {Object} AuthCallNonZeroValueExtErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when attempting to execute AUTHCALL with nonzero external value.
 *
 * AuthCallNonZeroValueExt errors can occur due to:
 * - Attempting to execute an AUTHCALL with a nonzero external value, which is not allowed.
 *
 * To debug an AuthCallNonZeroValueExt error:
 * 1. **Review Authorization Logic**: Ensure that AUTHCALL is not executed with a nonzero external value.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the AUTHCALL is attempted with nonzero external value.
 *
 * @example
 * ```typescript
 * import { AuthCallNonZeroValueExtError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an AuthCallNonZeroValueExtError
 * } catch (error) {
 *   if (error instanceof AuthCallNonZeroValueExtError) {
 *     console.error(error.message);
 *     // Handle the AuthCallNonZeroValueExt error
 *   }
 * }
 * ```
 *
 * @param {string} [message='AuthCallNonZeroValueExt error occurred.'] - A human-readable error message.
 * @param {AuthCallNonZeroValueExtErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'AuthCallNonZeroValueExtError'} _tag - Same as name, used internally.
 * @property {'AuthCallNonZeroValueExtError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AuthCallNonZeroValueExtError extends ExecutionError {
	static EVMErrorMessage = EVMErrorMessage.AUTHCALL_NONZERO_VALUEEXT
	/**
	 * Constructs an AuthCallNonZeroValueExtError.
	 *
	 * @param {string} [message='AuthCallNonZeroValueExt error occurred.'] - Human-readable error message.
	 * @param {AuthCallNonZeroValueExtErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'AuthCallNonZeroValueExt error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/authcallnonzerovalueexterror/',
		})

		/**
		 * @type {string}
		 * @override
		 */
		this.message = message

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
		/**
		 * @type {'AuthCallNonZeroValueExtError'}
		 */
		this._tag = 'AuthCallNonZeroValueExtError'
	}
}
