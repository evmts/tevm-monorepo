// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidAddressError.
 * @typedef {Object} InvalidAddressErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InvalidAddress'} _tag - Same as name, used internally.
 * @property {'InvalidAddress'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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
