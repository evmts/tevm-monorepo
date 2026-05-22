// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a LimitExceededError.
 * @typedef {Object} LimitExceededErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
}
