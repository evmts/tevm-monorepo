// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a RateLimitExceededError.
 * @typedef {Object} RateLimitExceededErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the rate limit has been exceeded.
 *
 * This error is typically encountered when a user or application exceeds the allowed number of requests within a certain timeframe.
 *
 * @example
 * try {
 *   // Some operation that can throw a RateLimitExceededError
 * } catch (error) {
 *   if (error instanceof RateLimitExceededError) {
 *     console.error(error.message);
 *     // Handle the rate limit exceeded error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {RateLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'RateLimitExceeded'} _tag - Same as name, used internally.
 * @property {'RateLimitExceeded'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class RateLimitExceededError extends BaseError {
	/**
	 * The error code for RateLimitExceededError.
	 * @type {number}
	 */
	static code = -32005

	/**
	 * Constructs a RateLimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {RateLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='RateLimitExceeded'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'RateLimitExceeded') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/ratelimitexceedederror/',
			},
			tag,
			RateLimitExceededError.code,
		)

	}

	/**
	 * @type {'RateLimitExceeded'}
	 * @override
	 */
	_tag = 'RateLimitExceeded'

	/**
	 * @type {'RateLimitExceeded'}
	 * @override
	 */
	name = 'RateLimitExceeded'
}
