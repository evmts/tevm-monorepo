import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidNonceError.
 * @typedef {Object} InvalidNonceErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the nonce parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a nonce parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidNonceError
 * } catch (error) {
 *   if (error instanceof InvalidNonceError) {
 *     console.error(error.message);
 *     // Handle the invalid nonce error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidNonceErrorParameters} [args={}] - Additional parameters for the InvalidNonceError.
 */
export class InvalidNonceError extends InvalidParamsError {
	/**
	 * Constructs an InvalidNonceError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidNonceErrorParameters} [args={}] - Additional parameters for the InvalidNonceError.
	 * @param {string} [tag='InvalidNonceError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidNonceError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidnonceerror/',
			},
			tag,
		)
	}
}
