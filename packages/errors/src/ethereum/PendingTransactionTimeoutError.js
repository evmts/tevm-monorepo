// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a PendingTransactionTimeoutError.
 * @typedef {Object} PendingTransactionTimeoutErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when a transaction is still pending and has not been included in a block.
 *
 * This error is typically encountered when a transaction takes too long to be confirmed.
 *
 * @example
 * try {
 *   // Some operation that can throw a PendingTransactionTimeoutError
 * } catch (error) {
 *   if (error instanceof PendingTransactionTimeoutError) {
 *     console.error(error.message);
 *     // Handle the pending transaction timeout error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {PendingTransactionTimeoutErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class PendingTransactionTimeoutError extends BaseError {
	/**
	 * The error code for PendingTransactionTimeoutError.
	 * @type {number}
	 */
	static code = -32002

	/**
	 * Constructs a PendingTransactionTimeoutError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {PendingTransactionTimeoutErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='PendingTransactionTimeout'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'PendingTransactionTimeout') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/pendingtransactiontimeouterror/',
			},
			tag,
			PendingTransactionTimeoutError.code,
		)
	}
}
