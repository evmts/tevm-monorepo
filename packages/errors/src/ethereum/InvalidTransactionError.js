// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidTransactionError.
 * @typedef {Object} InvalidTransactionErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a transaction is invalid.
 *
 * This error is typically encountered when a transaction does not conform to the required format or rules of the Ethereum network.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidTransactionError
 * } catch (error) {
 *   if (error instanceof InvalidTransactionError) {
 *     console.error(error.message);
 *     // Handle the invalid transaction error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidTransactionErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidTransaction'} _tag - Same as name, used internally.
 * @property {'InvalidTransaction'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidTransactionError extends BaseError {
	/**
	 * The error code for InvalidTransactionError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs an InvalidTransactionError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidTransactionErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidTransaction'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidTransaction') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidtransactionerror/',
			},
			tag,
			InvalidTransactionError.code,
		)
	}
}
