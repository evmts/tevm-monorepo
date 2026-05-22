import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceTooLowError.
 * @typedef {Object} NonceTooLowErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the nonce value is too low for a transaction.
 *
 * This error is typically encountered when a transaction is submitted with a nonce that is lower
 * than the current nonce for the sender's account. In Ethereum, nonces are used to ensure
 * transactions are processed in the correct order and to prevent double-spending.
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
 *     nonce: 5 // Assuming this nonce is too low
 *   })
 * } catch (error) {
 *   if (error instanceof NonceTooLowError) {
 *     console.error('Nonce too low:', error.message);
 *     console.log('Try increasing the nonce or use `await client.getTransactionCount(address)` to get the correct nonce');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {NonceTooLowErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class NonceTooLowError extends BaseError {
	/**
	 * The error code for NonceTooLowError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs a NonceTooLowError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NonceTooLowErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='NonceTooLow'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'NonceTooLow') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/noncetoolowerror/',
			},
			tag,
			NonceTooLowError.code,
		)
	}
}
