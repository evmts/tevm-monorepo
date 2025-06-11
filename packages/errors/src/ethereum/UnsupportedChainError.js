// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an UnsupportedChainError.
 * @typedef {Object} UnsupportedChainErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the specified chain is not supported.
 *
 * This error is typically encountered when a chain ID is provided that is not supported by the node or application.
 *
 * @example
 * try {
 *   // Some operation that can throw an UnsupportedChainError
 * } catch (error) {
 *   if (error instanceof UnsupportedChainError) {
 *     console.error(error.message);
 *     // Handle the unsupported chain error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {UnsupportedChainErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'UnsupportedChain'} _tag - Same as name, used internally.
 * @property {'UnsupportedChain'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class UnsupportedChainError extends BaseError {
	/**
	 * The error code for UnsupportedChainError.
	 * @type {number}
	 */
	static code = -32007

	/**
	 * Constructs an UnsupportedChainError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {UnsupportedChainErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='UnsupportedChain'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'UnsupportedChain') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/unsupportedchainerror/',
			},
			tag,
			UnsupportedChainError.code,
		)

	}

	/**
	 * @type {'UnsupportedChain'}
	 * @override
	 */
	_tag = 'UnsupportedChain'

	/**
	 * @type {'UnsupportedChain'}
	 * @override
	 */
	name = 'UnsupportedChain'
}
