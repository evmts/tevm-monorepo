// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a TransactionUnderpricedError.
 * @typedef {Object} TransactionUnderpricedErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the transaction gas price is too low.
 *
 * This error is typically encountered when a transaction is submitted with a gas price that is below the acceptable threshold.
 *
 * @example
 * try {
 *   // Some operation that can throw a TransactionUnderpricedError
 * } catch (error) {
 *   if (error instanceof TransactionUnderpricedError) {
 *     console.error(error.message);
 *     // Handle the transaction underpriced error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {TransactionUnderpricedErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class TransactionUnderpricedError extends BaseError {
	/**
	 * The error code for TransactionUnderpricedError.
	 * @type {number}
	 */
	static code = -32014

	/**
	 * Constructs a TransactionUnderpricedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {TransactionUnderpricedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='TransactionUnderpriced'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'TransactionUnderpriced') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/transactionunderpricederror/',
			},
			tag,
			TransactionUnderpricedError.code,
		)
	}
}
