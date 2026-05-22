// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidRequestError.
 * @typedef {Object} InvalidRequestErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the JSON sent is not a valid Request object.
 *
 * This error is typically encountered when a JSON-RPC request is malformed or does not conform to the required structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidRequestError
 * } catch (error) {
 *   if (error instanceof InvalidRequestError) {
 *     console.error(error.message);
 *     // Handle the invalid request error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidRequestErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidRequestError extends BaseError {
	/**
	 * The error code for InvalidRequestError.
	 * @type {number}
	 */
	static code = -32600

	/**
	 * Constructs an InvalidRequestError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidRequestErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidRequest'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidRequest') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidrequesterror/',
			},
			tag,
			InvalidRequestError.code,
		)
	}
}
