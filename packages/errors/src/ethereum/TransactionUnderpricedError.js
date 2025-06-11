// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a TransactionUnderpricedError.
 * @typedef {Object} TransactionUnderpricedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'TransactionUnderpriced'} _tag - Same as name, used internally.
 * @property {'TransactionUnderpriced'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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

	/**
	 * @type {'TransactionUnderpriced'}
	 * @override
	 */
	_tag = 'TransactionUnderpriced'

	/**
	 * @type {'TransactionUnderpriced'}
	 * @override
	 */
	name = 'TransactionUnderpriced'
}
