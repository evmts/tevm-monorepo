import { EVMError } from '@evmts/zevm/evm-error'
import { BaseError } from '../BaseError.js'

/**
 * Parameters for constructing a {@link InternalEvmError}.
 * @typedef {Object} InternalEvmErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InternalEvmError extends BaseError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INTERNAL_ERROR
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InternalEvmErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
