import { BaseError } from '../BaseError.js'
import { EVMErrorMessage } from '@ethereumjs/evm'

/**
 * Parameters for constructing a {@link InternalEvmError}.
 * @typedef {Object} InternalEvmErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an internal error within the EVM.
 * This error is typically encountered when there is an unexpected issue within the EVM execution or client.
 *
 * Internal errors can occur due to:
 * - Bugs in the EVM implementation.
 * - Issues with the client or environment running the EVM.
 * - Unexpected conditions that the EVM cannot handle.
 *
 * To debug an internal error:
 * 1. **Review Client Logs**: Check the client logs for any additional information about the internal error.
 * 2. **Check Environment**: Ensure that the environment running the EVM is properly configured and not causing issues.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the execution and identify where the internal error occurs.
 * 4. **Inspect EVM Code**: Manually inspect the EVM implementation code to understand and address the issue causing the internal error.
 *
 * @example
 * ```typescript
 * import { InternalEvmError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InternalEvmError
 * } catch (error) {
 *   if (error instanceof InternalEvmError) {
 *     console.error(error.message);
 *     // Handle the internal error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Internal error occurred.'] - A human-readable error message.
 * @param {InternalEvmErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InternalEvmError'} _tag - Same as name, used internally.
 * @property {'InternalEvmError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InternalEvmError extends BaseError {
	static EVMErrorMessage = EVMErrorMessage.INTERNAL_ERROR
	/**
	 * Constructs an InternalEvmError.
	 *
	 * @param {string} [message='Internal error occurred.'] - Human-readable error message.
	 * @param {InternalEvmErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'Internal error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/internalerror/',
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
		 * @type {'InternalEvmError'}
		 */
		this._tag = 'InternalEvmError'
	}
}
