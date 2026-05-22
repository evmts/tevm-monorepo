// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidTransactionError.
 * @typedef {Object} InvalidTransactionErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
