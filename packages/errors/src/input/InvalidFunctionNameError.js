import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidFunctionNameError.
 * @typedef {Object} InvalidFunctionNameErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the function name is invalid.
 *
 * This error is typically encountered when a transaction or operation references a function name that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidFunctionNameError
 * } catch (error) {
 *   if (error instanceof InvalidFunctionNameError) {
 *     console.error(error.message);
 *     // Handle the invalid function name error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidFunctionNameErrorParameters} [args={}] - Additional parameters for the InvalidFunctionNameError.
 * @property {'InvalidFunctionNameError'} _tag - Same as name, used internally.
 * @property {'InvalidFunctionNameError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidFunctionNameError extends InvalidParamsError {
	/**
	 * Constructs an InvalidFunctionNameError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidFunctionNameErrorParameters} [args={}] - Additional parameters for the InvalidFunctionNameError.
	 * @param {string} [tag='InvalidFunctionNameError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidFunctionNameError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidfunctionnameerror/',
			},
			tag,
		)
	}
}
