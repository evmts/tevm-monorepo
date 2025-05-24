import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link AuthCallUnsetError}.
 * @typedef {Object} AuthCallUnsetErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an EIP-3074 specific error that occurs when attempting to AUTHCALL without AUTH set.
 *
 * AuthCallUnset errors can occur due to:
 * - Attempting to execute an AUTHCALL without setting the necessary authorization.
 *
 * To debug an AuthCallUnset error:
 * 1. **Review Authorization Logic**: Ensure that the necessary authorization is set before executing an AUTHCALL.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the AUTHCALL is attempted without AUTH set.
 *
 * @example
 * ```typescript
 * import { AuthCallUnsetError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an AuthCallUnsetError
 * } catch (error) {
 *   if (error instanceof AuthCallUnsetError) {
 *     console.error(error.message);
 *     // Handle the AuthCallUnset error
 *   }
 * }
 * ```
 *
 * @param {string} [message='AuthCallUnset error occurred.'] - A human-readable error message.
 * @param {AuthCallUnsetErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'AuthCallUnsetError'} _tag - Same as name, used internally.
 * @property {'AuthCallUnsetError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AuthCallUnsetError extends ExecutionError {
	// Note: AUTHCALL_UNSET was removed from ethereumjs
	/** @type {string} */	// static EVMErrorMessage = EVMError.errorMessages.AUTHCALL_UNSET
	/**
	 * Constructs an AuthCallUnsetError.
	 * Represents an EIP-3074 specific error that occurs when attempting to AUTHCALL without AUTH set.
	 *
	 * AuthCallUnset errors can occur due to:
	 * - Attempting to execute an AUTHCALL without setting the necessary authorization.
	 *
	 * To debug an AuthCallUnset error:
	 * 1. **Review Authorization Logic**: Ensure that the necessary authorization is set before executing an AUTHCALL.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the AUTHCALL is attempted without AUTH set.
	 *
	 * @param {string} [message='AuthCallUnset error occurred.'] - Human-readable error message.
	 * @param {AuthCallUnsetErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='AuthCallUnsetError'] - The tag for the error.
	 */
	constructor(message = 'AuthCallUnset error occurred.', args = {}, tag = 'AuthCallUnsetError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/authcallunseterror/',
			},
			tag,
		)

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
		 * @type {'AuthCallUnsetError'}
		 */
		this._tag = 'AuthCallUnsetError'
	}
}
