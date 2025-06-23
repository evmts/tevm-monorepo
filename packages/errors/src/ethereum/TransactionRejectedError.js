// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a TransactionRejectedError.
 * @typedef {Object} TransactionRejectedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a transaction is rejected by the Ethereum node.
 *
 * This error is typically encountered when a transaction fails validation or other checks by the node.
 *
 * @example
 * try {
 *   // Some operation that can throw a TransactionRejectedError
 * } catch (error) {
 *   if (error instanceof TransactionRejectedError) {
 *     console.error(error.message);
 *     // Handle the transaction rejected error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {TransactionRejectedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class TransactionRejectedError extends BaseError {
	/**
	 * The error code for TransactionRejectedError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs a TransactionRejectedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {TransactionRejectedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='TransactionRejected'] - The tag for the error.}
	 */
	constructor(message, args = {}, tag = 'TransactionRejected') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/transactionrejectederror/',
			},
			tag,
			TransactionRejectedError.code,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
