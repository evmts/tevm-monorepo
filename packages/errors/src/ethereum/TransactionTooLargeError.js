// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a TransactionTooLargeError.
 * @typedef {Object} TransactionTooLargeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when a transaction is too large.
 *
 * This error is typically encountered when a transaction exceeds the maximum allowed size.
 *
 * @example
 * try {
 *   // Some operation that can throw a TransactionTooLargeError
 * } catch (error) {
 *   if (error instanceof TransactionTooLargeError) {
 *     console.error(error.message);
 *     // Handle the transaction too large error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {TransactionTooLargeErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class TransactionTooLargeError extends BaseError {
	/**
	 * The error code for TransactionTooLargeError.
	 * @type {number}
	 */
	static code = -32011

	/**
	 * Constructs a TransactionTooLargeError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {TransactionTooLargeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='TransactionTooLarge'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'TransactionTooLarge') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/transactiontoolargeerror/',
			},
			tag,
			TransactionTooLargeError.code,
		)
	}
}
