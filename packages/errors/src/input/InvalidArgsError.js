import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidArgsError.
 * @typedef {Object} InvalidArgsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when arguments provided to a contract or script call are invalid.
 *
 * This error is typically encountered when the arguments provided do not match the expected types or structure required by the contract or script.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidArgsError
 * } catch (error) {
 *   if (error instanceof InvalidArgsError) {
 *     console.error(error.message);
 *     // Handle the invalid arguments error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidArgsErrorParameters} [args={}] - Additional parameters for the InvalidParamsError.
 * @property {'InvalidArgsError'} _tag - Same as name, used internally.
 * @property {'InvalidArgsError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidArgsError extends InvalidParamsError {
	/**
	 * Constructs an InvalidArgsError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidArgsErrorParameters} [args={}] - Additional parameters for the InvalidParamsError.
	 * @param {string} [tag='InvalidArgsError'] - The tag for the error.
	 */
	constructor(message, args, tag) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidargserror/',
			},
			tag,
		)
	}
}
