// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ChainIdMismatchError.
 * @typedef {Object} ChainIdMismatchErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the chain ID does not match the expected value.
 *
 * This error is typically encountered when a transaction or operation specifies a chain ID that does not match the chain ID of the Ethereum node.
 *
 * @example
 * try {
 *   // Some operation that can throw a ChainIdMismatchError
 * } catch (error) {
 *   if (error instanceof ChainIdMismatchError) {
 *     console.error(error.message);
 *     // Handle the chain ID mismatch error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ChainIdMismatchErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ChainIdMismatchError extends BaseError {
	/**
	 * The error code for ChainIdMismatchError.
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Constructs a ChainIdMismatchError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ChainIdMismatchErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ChainIdMismatch'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ChainIdMismatch') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/chainidmismatcherror/',
			},
			tag,
			ChainIdMismatchError.code,
		)
	}
}
