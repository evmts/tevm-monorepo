// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a GasLimitExceededError.
 * @typedef {Object} GasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the gas limit is exceeded.
 *
 * This error is typically encountered when a transaction or set of transactions exceed the specified gas limit.
 *
 * @example
 * try {
 *   // Some operation that can throw a GasLimitExceededError
 * } catch (error) {
 *   if (error instanceof GasLimitExceededError) {
 *     console.error(error.message);
 *     // Handle the gas limit exceeded error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {GasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class GasLimitExceededError extends BaseError {
	/**
	 * The error code for GasLimitExceededError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs a GasLimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {GasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='GasLimitExceeded'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'GasLimitExceeded') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/gaslimitexceedederror/',
			},
			tag,
			GasLimitExceededError.code,
		)
	}
}
