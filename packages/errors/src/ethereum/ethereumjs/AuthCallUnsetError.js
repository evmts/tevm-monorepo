// Note: EVMError import removed as AUTHCALL_UNSET was removed from newer EVM runtimes.
// import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link AuthCallUnsetError}.
 * @typedef {Object} AuthCallUnsetErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class AuthCallUnsetError extends ExecutionError {
	// Note: AUTHCALL_UNSET was removed from newer EVM runtimes.
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.AUTHCALL_UNSET
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {AuthCallUnsetErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
