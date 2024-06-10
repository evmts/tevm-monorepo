import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidRequestError.
 * @typedef {Object} InvalidRequestErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the request is invalid.
 *
 * This error is typically encountered when a transaction or operation references a request that is invalid or does not conform to the expected structure.
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
 * @param {InvalidRequestErrorParameters} [args={}] - Additional parameters for the InvalidRequestError.
 * @property {'InvalidRequestError'} _tag - Same as name, used internally.
 * @property {'InvalidRequestError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidRequestError extends InvalidParamsError {
	/**
	 * Constructs an InvalidRequestError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidRequestErrorParameters} [args={}] - Additional parameters for the InvalidRequestError.
	 */
	constructor(message, args = {}) {
		super(message, {
			...args,
			docsBaseUrl: 'https://tevm.sh',
			docsPath: '/reference/tevm/errors/classes/invalidrequesterror/',
		})

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
