// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceAlreadyUsedError.
 * @typedef {Object} NonceAlreadyUsedErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the specified nonce has already been used.
 *
 * This error is typically encountered when a transaction is attempted with a nonce that has already been used in a previous transaction.
 *
 * @example
 * try {
 *   // Some operation that can throw a NonceAlreadyUsedError
 * } catch (error) {
 *   if (error instanceof NonceAlreadyUsedError) {
 *     console.error(error.message);
 *     // Handle the nonce already used error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {NonceAlreadyUsedErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class NonceAlreadyUsedError extends BaseError {
	/**
	 * The error code for NonceAlreadyUsedError.
	 * @type {number}
	 */
	static code = -32008

	/**
	 * Constructs a NonceAlreadyUsedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NonceAlreadyUsedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='NonceAlreadyUsed'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'NonceAlreadyUsed') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/noncealreadyusederror/',
			},
			tag,
			NonceAlreadyUsedError.code,
		)
	}
}
