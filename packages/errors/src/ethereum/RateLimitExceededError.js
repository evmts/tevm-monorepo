// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a RateLimitExceededError.
 * @typedef {Object} RateLimitExceededErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
}
