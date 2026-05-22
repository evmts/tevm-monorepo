import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidCallerError.
 * @typedef {Object} InvalidCallerErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the caller parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a caller parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidCallerError
 * } catch (error) {
 *   if (error instanceof InvalidCallerError) {
 *     console.error(error.message);
 *     // Handle the invalid caller error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidCallerErrorParameters} [args={}] - Additional parameters for the InvalidCallerError.
 */
export class InvalidCallerError extends InvalidParamsError {
	/**
	 * Constructs an InvalidCallerError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidCallerErrorParameters} [args={}] - Additional parameters for the InvalidCallerError.
	 * @param {string} [tag='InvalidCallerError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidCallerError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidcallererror/',
			},
			tag,
		)
	}
}
