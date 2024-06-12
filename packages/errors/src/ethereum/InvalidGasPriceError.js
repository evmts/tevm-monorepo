// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidGasPriceError.
 * @typedef {Object} InvalidGasPriceErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the specified gas price is invalid.
 *
 * This error is typically encountered when a transaction is submitted with a gas price that is not acceptable by the Ethereum network.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidGasPriceError
 * } catch (error) {
 *   if (error instanceof InvalidGasPriceError) {
 *     console.error(error.message);
 *     // Handle the invalid gas price error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidGasPriceErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidGasPrice'} _tag - Same as name, used internally.
 * @property {'InvalidGasPrice'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidGasPriceError extends BaseError {
	/**
	 * Constructs an InvalidGasPriceError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidGasPriceErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidgaspriceerror/',
			},
			'InvalidGasPrice',
			-32012,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'InvalidGasPrice'}
	 * @override
	 */
	_tag = 'InvalidGasPrice'

	/**
	 * @type {'InvalidGasPrice'}
	 * @override
	 */
	name = 'InvalidGasPrice'
}
