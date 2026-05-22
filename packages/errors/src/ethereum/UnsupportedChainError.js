// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an UnsupportedChainError.
 * @typedef {Object} UnsupportedChainErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the specified chain is not supported.
 *
 * This error is typically encountered when a chain ID is provided that is not supported by the node or application.
 *
 * @example
 * try {
 *   // Some operation that can throw an UnsupportedChainError
 * } catch (error) {
 *   if (error instanceof UnsupportedChainError) {
 *     console.error(error.message);
 *     // Handle the unsupported chain error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {UnsupportedChainErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class UnsupportedChainError extends BaseError {
	/**
	 * The error code for UnsupportedChainError.
	 * @type {number}
	 */
	static code = -32007

	/**
	 * Constructs an UnsupportedChainError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {UnsupportedChainErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='UnsupportedChain'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'UnsupportedChain') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/unsupportedchainerror/',
			},
			tag,
			UnsupportedChainError.code,
		)
	}
}
