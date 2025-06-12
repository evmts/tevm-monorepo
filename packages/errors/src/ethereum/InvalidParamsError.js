import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidParamsError.
 * @typedef {Object} InvalidParamsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when invalid method parameters are provided.
 *
 * This error is typically encountered when a JSON-RPC request is made with parameters that are not valid or do not match the expected types.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidParamsError
 * } catch (error) {
 *   if (error instanceof InvalidParamsError) {
 *     console.error(error.message);
 *     // Handle the invalid params error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidParamsErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidParamsError extends BaseError {
	/**
	 * The error code for InvalidParamsError.
	 * @type {number}
	 */
	static code = -32602

	/**
	 * Constructs an InvalidParamsError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidParamsErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidParams'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidParams') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidparamserror/',
			},
			tag,
			InvalidParamsError.code,
		)
	}
}
