// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ResourceUnavailableError.
 * @typedef {Object} ResourceUnavailableErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the requested resource is temporarily unavailable.
 *
 * This error is typically encountered when a JSON-RPC request is made for a resource that is temporarily unavailable due to server issues or other reasons.
 *
 * @example
 * try {
 *   // Some operation that can throw a ResourceUnavailableError
 * } catch (error) {
 *   if (error instanceof ResourceUnavailableError) {
 *     console.error(error.message);
 *     // Handle the resource unavailable error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ResourceUnavailableErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class ResourceUnavailableError extends BaseError {
	/**
	 * The error code for ResourceUnavailableError.
	 * @type {number}
	 */
	static code = -32002

	/**
	 * Constructs a ResourceUnavailableError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ResourceUnavailableErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ResourceUnavailable'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ResourceUnavailable') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/resourceunavailableerror/',
			},
			tag,
			ResourceUnavailableError.code,
		)
	}
}
