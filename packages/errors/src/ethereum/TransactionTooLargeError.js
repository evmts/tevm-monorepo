// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a TransactionTooLargeError.
 * @typedef {Object} TransactionTooLargeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
