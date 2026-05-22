import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a BlockGasLimitExceededError.
 * @typedef {Object} BlockGasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the block gas limit has been exceeded.
 *
 * This error is typically encountered when a transaction or set of transactions in a block
 * consume more gas than the block's gas limit allows. Each block in Ethereum has a maximum
 * amount of gas that can be used by all transactions within it.
 *
 * The error code -32006 is a non-standard extension used by some Ethereum clients to
 * indicate this specific condition.
 *
 * @example
 * try {
 *   const result = await client.sendTransaction({
 *     // ... transaction details
 *   })
 * } catch (error) {
 *   if (error instanceof BlockGasLimitExceededError) {
 *     console.error('Block gas limit exceeded:', error.message);
 *     console.log('Consider splitting the transaction or waiting for a block with more available gas');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {BlockGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class BlockGasLimitExceededError extends BaseError {
	/**
	 * The error code for BlockGasLimitExceededError.
	 * @type {number}
	 */
	static code = -32006

	/**
	 * Constructs a BlockGasLimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {BlockGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BlockGasLimitExceeded'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'BlockGasLimitExceeded') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/blockgaslimitexceedederror/',
			},
			tag,
			BlockGasLimitExceededError.code,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
