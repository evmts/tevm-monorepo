import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidOriginError.
 * @typedef {Object} InvalidOriginErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the origin parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references an origin parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidOriginError
 * } catch (error) {
 *   if (error instanceof InvalidOriginError) {
 *     console.error(error.message);
 *     // Handle the invalid origin error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidOriginErrorParameters} [args={}] - Additional parameters for the InvalidOriginError.
 */
export class InvalidOriginError extends InvalidParamsError {
	/**
	 * Constructs an InvalidOriginError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidOriginErrorParameters} [args={}] - Additional parameters for the InvalidOriginError.
	 * @param {string} [tag='InvalidOriginError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidOriginError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidoriginerror/',
			},
			tag,
		)
	}
}
