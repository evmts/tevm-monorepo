// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InsufficientFundsError.
 * @typedef {Object} InsufficientFundsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InsufficientFunds'} _tag - Same as name, used internally.
 * @property {'InsufficientFunds'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32003), standard Ethereum JSON-RPC error code for transaction rejected.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
