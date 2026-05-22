// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a MethodNotSupportedError.
 * @typedef {Object} MethodNotSupportedErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
