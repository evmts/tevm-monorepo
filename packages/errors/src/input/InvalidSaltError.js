import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidSaltError.
 * @typedef {Object} InvalidSaltErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the salt parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a salt parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidSaltError
 * } catch (error) {
 *   if (error instanceof InvalidSaltError) {
 *     console.error(error.message);
 *     // Handle the invalid salt error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidSaltErrorParameters} [args={}] - Additional parameters for the InvalidSaltError.
 */
export class InvalidSaltError extends InvalidParamsError {
	/**
	 * Constructs an InvalidSaltError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidSaltErrorParameters} [args={}] - Additional parameters for the InvalidSaltError.
	 * @param {string} [tag='InvalidSaltError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidSaltError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidsalterror/',
			},
			tag,
		)
	}
}
