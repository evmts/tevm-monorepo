// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidGasPriceError.
 * @typedef {Object} InvalidGasPriceErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidGasPriceError extends BaseError {
	/**
	 * The error code for InvalidGasPriceError.
	 * @type {number}
	 */
	static code = -32012

	/**
	 * Constructs an InvalidGasPriceError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidGasPriceErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidGasPrice'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidGasPrice') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidgaspriceerror/',
			},
			tag,
			InvalidGasPriceError.code,
		)
	}
}
