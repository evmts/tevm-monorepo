import { EVMError } from '../EVMError.js'
import { BaseError } from '../BaseError.js'

/**
 * Parameters for constructing a {@link InternalEvmError}.
 * @typedef {Object} InternalEvmErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an internal error within the EVM. This error should not typically happen
 * This error is typically encountered when there is an unexpected issue within the EVM execution or client.
 *
 * Internal errors can occur due to:
 * - Bugs in the EVM implementation.
 * - Bugs in Tevm
 *
 * If you encounter this error please open an issue on the Tevm GitHub repository.
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
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INTERNAL_ERROR
	/**
	 * Constructs an InternalEvmError.
	 * Represents an internal error within the EVM. This error should not typically happen
	 * This error is typically encountered when there is an unexpected issue within the EVM execution or client.
	 *
	 * Internal errors can occur due to:
	 * - Bugs in the EVM implementation.
	 * - Bugs in Tevm
	 *
	 * If you encounter this error please open an issue on the Tevm GitHub repository.
	 *
	 * @param {string} [message='Internal error occurred.'] - Human-readable error message.
	 * @param {InternalEvmErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InternalEvmError'] - The tag for the error.
	 */
	constructor(message = 'Internal error occurred.', args = {}, tag = 'InternalEvmError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/internalerror/',
			},
			tag,
		)
	}
}
