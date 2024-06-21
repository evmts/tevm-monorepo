// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a NonceTooHighError.
 * @typedef {Object} NonceTooHighErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the nonce value is too high.
 *
 * This error is typically encountered when a transaction is attempted with a nonce that is higher than the next expected nonce.
 *
 * @example
 * try {
 *   // Some operation that can throw a NonceTooHighError
 * } catch (error) {
 *   if (error instanceof NonceTooHighError) {
 *     console.error(error.message);
 *     // Handle the nonce too high error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {NonceTooHighErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'NonceTooHigh'} _tag - Same as name, used internally.
 * @property {'NonceTooHigh'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class NonceTooHighError extends BaseError {
	/**
	 * Constructs a NonceTooHighError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NonceTooHighErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='NonceTooHigh'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'NonceTooHigh') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/nonceoohigherror/',
			},
			tag,
			-32000,
		)
	}
}
