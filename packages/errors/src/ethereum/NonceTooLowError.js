// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceTooLowError.
 * @typedef {Object} NonceTooLowErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the nonce value is too low.
 *
 * This error is typically encountered when a transaction is attempted with a nonce that is lower than the next expected nonce.
 *
 * @example
 * try {
 *   // Some operation that can throw a NonceTooLowError
 * } catch (error) {
 *   if (error instanceof NonceTooLowError) {
 *     console.error(error.message);
 *     // Handle the nonce too low error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {NonceTooLowErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'NonceTooLow'} _tag - Same as name, used internally.
 * @property {'NonceTooLow'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class NonceTooLowError extends BaseError {
	/**
	 * Constructs a NonceTooLowError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NonceTooLowErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='NonceTooLow'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'NonceTooLow') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/noncetoolowerror/',
			},
			tag,
			-32000,
		)
	}
}
