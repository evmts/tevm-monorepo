import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a BlockGasLimitExceededError.
 * @typedef {Object} BlockGasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'BlockGasLimitExceeded'} _tag - Same as name, used internally.
 * @property {'BlockGasLimitExceeded'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32006), a non-standard extension for this specific error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
