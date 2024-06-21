// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a PendingTransactionTimeoutError.
 * @typedef {Object} PendingTransactionTimeoutErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'PendingTransactionTimeout'} _tag - Same as name, used internally.
 * @property {'PendingTransactionTimeout'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class PendingTransactionTimeoutError extends BaseError {
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
			-32002,
		)
	}
}
