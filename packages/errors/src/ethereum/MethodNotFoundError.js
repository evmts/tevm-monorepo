// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a MethodNotFoundError.
 * @typedef {Object} MethodNotFoundErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the specified method does not exist or is not available.
 *
 * This error is typically encountered when a JSON-RPC request is made with a method name that the server does not recognize or support.
 *
 * @example
 * try {
 *   // Some operation that can throw a MethodNotFoundError
 * } catch (error) {
 *   if (error instanceof MethodNotFoundError) {
 *     console.error(error.message);
 *     // Handle the method not found error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {MethodNotFoundErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'MethodNotFound'} _tag - Same as name, used internally.
 * @property {'MethodNotFound'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class MethodNotFoundError extends BaseError {
	/**
	 * The error code for MethodNotFoundError.
	 * @type {number}
	 */
	static code = -32601

	/**
	 * Constructs a MethodNotFoundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {MethodNotFoundErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='MethodNotFound'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'MethodNotFound') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/methodnotfounderror/',
			},
			tag,
			MethodNotFoundError.code,
		)
	}

	/**
	 * @type {'MethodNotFound'}
	 * @override
	 */
	_tag = 'MethodNotFound'

	/**
	 * @type {'MethodNotFound'}
	 * @override
	 */
	name = 'MethodNotFound'
}
