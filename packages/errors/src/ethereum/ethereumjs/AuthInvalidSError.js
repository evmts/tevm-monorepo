import { EVMErrorMessage } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link AuthInvalidSError}.
 * @typedef {Object} AuthInvalidSErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when an invalid signature with s-values greater than secp256k1n/2 is encountered.
 *
 * AuthInvalidS errors can occur due to:
 * - Providing a signature with an s-value greater than secp256k1n/2, which is considered invalid.
 *
 * To debug an AuthInvalidS error:
 * 1. **Review Signature Logic**: Ensure that the signature provided adheres to the secp256k1 standards.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid signature is encountered.
 *
 * @example
 * ```typescript
 * import { AuthInvalidSError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an AuthInvalidSError
 * } catch (error) {
 *   if (error instanceof AuthInvalidSError) {
 *     console.error(error.message);
 *     // Handle the AuthInvalidS error
 *   }
 * }
 * ```
 *
 * @param {string} [message='AuthInvalidS error occurred.'] - A human-readable error message.
 * @param {AuthInvalidSErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'AuthInvalidSError'} _tag - Same as name, used internally.
 * @property {'AuthInvalidSError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AuthInvalidSError extends ExecutionError {
	static EVMErrorMessage = EVMErrorMessage.AUTH_INVALID_S
	/**
	 * Constructs an AuthInvalidSError.
	 *
	 * @param {string} [message='AuthInvalidS error occurred.'] - Human-readable error message.
	 * @param {AuthInvalidSErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'AuthInvalidS error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/authinvalidserror/',
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
		 * @type {'AuthInvalidSError'}
		 */
		this._tag = 'AuthInvalidSError'
	}
}
