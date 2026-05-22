// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InsufficientFundsError.
 * @typedef {Object} InsufficientFundsErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when there are insufficient funds for a transaction.
 *
 * This error is typically encountered when a transaction is attempted with a balance that is too low to cover the transaction cost.
 *
 * The error code -32003 is a standard Ethereum JSON-RPC error code indicating a transaction rejected,
 * which is used when a transaction is not accepted for processing due to validation failures
 * such as insufficient funds.
 *
 * @example
 * try {
 *   // Some operation that can throw an InsufficientFundsError
 * } catch (error) {
 *   if (error instanceof InsufficientFundsError) {
 *     console.error(error.message);
 *     // Handle the insufficient funds error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InsufficientFundsErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InsufficientFundsError extends BaseError {
	/**
	 * The error code for InsufficientFundsError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs an InsufficientFundsError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InsufficientFundsErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InsufficientFunds'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InsufficientFunds') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/insufficientfundserror/',
			},
			tag,
			InsufficientFundsError.code,
		)
	}
}
