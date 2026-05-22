import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidDepthError.
 * @typedef {Object} InvalidDepthErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the depth parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a depth parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidDepthError
 * } catch (error) {
 *   if (error instanceof InvalidDepthError) {
 *     console.error(error.message);
 *     // Handle the invalid depth error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidDepthErrorParameters} [args={}] - Additional parameters for the InvalidDepthError.
 */
export class InvalidDepthError extends InvalidParamsError {
	/**
	 * Constructs an InvalidDepthError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidDepthErrorParameters} [args={}] - Additional parameters for the InvalidDepthError.
	 * @param {string} [tag='InvalidDepthError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidDepthError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invaliddeptherror/',
			},
			tag,
		)
	}
}
