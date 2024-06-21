// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ParseError.
 * @typedef {Object} ParseErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when invalid JSON is received by the server, resulting in a parsing error.
 *
 * This error is typically encountered when a JSON-RPC request is malformed or the JSON syntax is incorrect.
 *
 * @example
 * try {
 *   // Some operation that can throw a ParseError
 * } catch (error) {
 *   if (error instanceof ParseError) {
 *     console.error(error.message);
 *     // Handle the parse error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ParseErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'ParseError'} _tag - Same as name, used internally.
 * @property {'ParseError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ParseError extends BaseError {
	/**
	 * Constructs a ParseError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ParseErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ParseError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ParseError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/parseerror/',
			},
			tag,
			-32700,
		)
	}
}
