import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidParamsError.
 * @typedef {Object} InvalidParamsErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
