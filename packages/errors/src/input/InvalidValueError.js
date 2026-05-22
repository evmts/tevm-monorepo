import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidValueError.
 * @typedef {Object} InvalidValueErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
