// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceAlreadyUsedError.
 * @typedef {Object} NonceAlreadyUsedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'NonceAlreadyUsed'} _tag - Same as name, used internally.
 * @property {'NonceAlreadyUsed'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
