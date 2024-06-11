// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a GasLimitExceededError.
 * @typedef {Object} GasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the gas limit is exceeded.
 * This class is abstract and should be extended by other error classes.
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
 * @abstract
 * @param {string} message - A human-readable error message.
 * @param {GasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class GasLimitExceededError extends BaseError {
	/**
	 * Constructs a GasLimitExceededError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {GasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		if (new.target === GasLimitExceededError) {
			throw new TypeError('Cannot construct GasLimitExceededError instances directly')
		}
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/gaslimitexceedederror/',
			},
			'GasLimitExceeded',
			-32000,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {string}
	 * @abstract
	 * @override
	 */
	_tag = 'GasLimitExceeded'

	/**
	 * @type {string}
	 * @abstract
	 * @override
	 */
	name = 'GasLimitExceeded'
}
