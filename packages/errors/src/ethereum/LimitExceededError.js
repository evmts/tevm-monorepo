// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a LimitExceededError.
 * @typedef {Object} LimitExceededErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a request limit is exceeded.
 *
 * This error is typically encountered when a user or application exceeds the allowed number of requests within a certain timeframe.
 *
 * @example
 * try {
 *   // Some operation that can throw a LimitExceededError
 * } catch (error) {
 *   if (error instanceof LimitExceededError) {
 *     console.error(error.message);
 *     // Handle the limit exceeded error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {LimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'LimitExceeded'} _tag - Same as name, used internally.
 * @property {'LimitExceeded'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class LimitExceededError extends BaseError {
	/**
	 * The error code for LimitExceededError.
	 * @type {number}
	 */
	static code = -32005

	/**
	 * Constructs a LimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {LimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='LimitExceeded'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'LimitExceeded') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/limitexceedederror/',
			},
			tag,
			LimitExceededError.code,
		)
	}

	/**
	 * @type {'LimitExceeded'}
	 * @override
	 */
	_tag = 'LimitExceeded'

	/**
	 * @type {'LimitExceeded'}
	 * @override
	 */
	name = 'LimitExceeded'
}