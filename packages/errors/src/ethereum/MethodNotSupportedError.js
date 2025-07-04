// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a MethodNotSupportedError.
 * @typedef {Object} MethodNotSupportedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the requested method is not supported by the Ethereum node.
 *
 * This error is typically encountered when a JSON-RPC request is made with a method that the server does not support.
 *
 * @example
 * try {
 *   // Some operation that can throw a MethodNotSupportedError
 * } catch (error) {
 *   if (error instanceof MethodNotSupportedError) {
 *     console.error(error.message);
 *     // Handle the method not supported error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {MethodNotSupportedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class MethodNotSupportedError extends BaseError {
	/**
	 * The error code for MethodNotSupportedError.
	 * @type {number}
	 */
	static code = -32004

	/**
	 * Constructs a MethodNotSupportedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {MethodNotSupportedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='MethodNotSupported'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'MethodNotSupported') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/methodnotsupportederror/',
			},
			tag,
			MethodNotSupportedError.code,
		)
	}
}
