// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceTooHighError.
 * @typedef {Object} NonceTooHighErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the nonce value is too high for a transaction.
 *
 * This error is typically encountered when a transaction is submitted with a nonce that is higher
 * than the expected next nonce for the sender's account. In Ethereum, nonces must be used in strict
 * sequential order to ensure transactions are processed correctly.
 *
 * The error code -32003 is a standard Ethereum JSON-RPC error code indicating a transaction rejected,
 * which is used when a transaction is not accepted for processing due to validation failures
 * such as incorrect nonce values.
 *
 * @example
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     value: '0x1',
 *     nonce: 100 // Assuming this nonce is too high
 *   })
 * } catch (error) {
 *   if (error instanceof NonceTooHighError) {
 *     console.error('Nonce too high:', error.message);
 *     console.log('Try decreasing the nonce or use `await client.getTransactionCount(address)` to get the correct nonce');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {NonceTooHighErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32003), standard Ethereum JSON-RPC error code for transaction rejected.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class NonceTooHighError extends BaseError {
	/**
	 * The error code for NonceTooHighError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs a NonceTooHighError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NonceTooHighErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='NonceTooHigh'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'NonceTooHigh') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/noncetoohigherror/',
			},
			tag,
			NonceTooHighError.code,
		)
	}
}
