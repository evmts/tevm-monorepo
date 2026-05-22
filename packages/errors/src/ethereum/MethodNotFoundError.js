// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a MethodNotFoundError.
 * @typedef {Object} MethodNotFoundErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
}
