// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidAddressError.
 * @typedef {Object} InvalidAddressErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the specified address is invalid.
 *
 * This error is typically encountered when an address provided in a transaction or contract call is not a valid Ethereum address.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidAddressError
 * } catch (error) {
 *   if (error instanceof InvalidAddressError) {
 *     console.error(error.message);
 *     // Handle the invalid address error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidAddressErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidAddressError extends BaseError {
	/**
	 * The error code for InvalidAddressError.
	 * @type {number}
	 */
	static code = -32013

	/**
	 * Constructs an InvalidAddressError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidAddressErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidAddress'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidAddress') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidaddresserror/',
			},
			tag,
			InvalidAddressError.code,
		)
	}
}
