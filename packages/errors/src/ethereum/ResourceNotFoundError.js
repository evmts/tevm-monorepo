// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ResourceNotFoundError.
 * @typedef {Object} ResourceNotFoundErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the requested resource does not exist.
 *
 * This error is typically encountered when a JSON-RPC request is made for a resource that does not exist.
 *
 * @example
 * try {
 *   // Some operation that can throw a ResourceNotFoundError
 * } catch (error) {
 *   if (error instanceof ResourceNotFoundError) {
 *     console.error(error.message);
 *     // Handle the resource not found error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ResourceNotFoundErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class ResourceNotFoundError extends BaseError {
	/**
	 * The error code for ResourceNotFoundError.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Constructs a ResourceNotFoundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ResourceNotFoundErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ResourceNotFound'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ResourceNotFound') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/resourcenotfounderror/',
			},
			tag,
			ResourceNotFoundError.code,
		)
	}
}
