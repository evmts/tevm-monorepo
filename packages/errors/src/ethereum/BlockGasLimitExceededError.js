// Ideally we get this from viem
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
 * This error is typically encountered when a transaction or set of transactions exceed the gas limit for a block.
 *
 * @example
 * try {
 *   // Some operation that can throw a BlockGasLimitExceededError
 * } catch (error) {
 *   if (error instanceof BlockGasLimitExceededError) {
 *     console.error(error.message);
 *     // Handle the block gas limit exceeded error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {BlockGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'BlockGasLimitExceeded'} _tag - Same as name, used internally.
 * @property {'BlockGasLimitExceeded'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BlockGasLimitExceededError extends BaseError {
	/**
	 * Constructs a BlockGasLimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {BlockGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/blockgaslimitexceedederror/',
			},
			'BlockGasLimitExceeded',
			-32006,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'BlockGasLimitExceeded'}
	 * @override
	 */
	_tag = 'BlockGasLimitExceeded'

	/**
	 * @type {'BlockGasLimitExceeded'}
	 * @override
	 */
	name = 'BlockGasLimitExceeded'
}
