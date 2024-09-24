// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ResourceUnavailableError.
 * @typedef {Object} ResourceUnavailableErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'ResourceUnavailable'} _tag - Same as name, used internally.
 * @property {'ResourceUnavailable'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
