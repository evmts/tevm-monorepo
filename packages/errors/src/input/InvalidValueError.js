import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidValueError.
 * @typedef {Object} InvalidValueErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the 'value' parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a 'value' parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidValueError
 * } catch (error) {
 *   if (error instanceof InvalidValueError) {
 *     console.error(error.message);
 *     // Handle the invalid 'value' error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidValueErrorParameters} [args={}] - Additional parameters for the InvalidValueError.
 * @property {'InvalidValueError'} _tag - Same as name, used internally.
 * @property {'InvalidValueError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidValueError extends InvalidParamsError {
	/**
	 * Constructs an InvalidValueError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidValueErrorParameters} [args={}] - Additional parameters for the InvalidValueError.
	 * @param {string} [tag='InvalidValueError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidValueError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidvalueerror/',
			},
			tag,
		)
	}
}
