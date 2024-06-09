// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ResourceNotFoundError.
 * @typedef {Object} ResourceNotFoundErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the requested resource was not found on the Ethereum node.
 *
 * This error is typically encountered when a JSON-RPC request is made for a resource that does not exist or is not available.
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
 * @property {'ResourceNotFound'} _tag - Same as name, used internally.
 * @property {'ResourceNotFound'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ResourceNotFoundError extends BaseError {
	/**
	 * Constructs a ResourceNotFoundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ResourceNotFoundErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/resourcenotfounderror/',
			},
			'ResourceNotFound',
			-32001,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'ResourceNotFound'}
	 * @override
	 */
	_tag = 'ResourceNotFound'

	/**
	 * @type {'ResourceNotFound'}
	 * @override
	 */
	name = 'ResourceNotFound'
}
