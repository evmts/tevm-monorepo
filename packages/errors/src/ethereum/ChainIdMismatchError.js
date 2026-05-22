// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ChainIdMismatchError.
 * @typedef {Object} ChainIdMismatchErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
