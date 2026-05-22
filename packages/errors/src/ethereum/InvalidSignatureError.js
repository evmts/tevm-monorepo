// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidSignatureError.
 * @typedef {Object} InvalidSignatureErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when an invalid signature is provided.
 *
 * This error is typically encountered when a transaction or message is signed with a signature that is not valid.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidSignatureError
 * } catch (error) {
 *   if (error instanceof InvalidSignatureError) {
 *     console.error(error.message);
 *     // Handle the invalid signature error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidSignatureErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidSignatureError extends BaseError {
	/**
	 * The error code for InvalidSignatureError.
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Constructs an InvalidSignatureError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidSignatureErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidSignature'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidSignature') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidsignatureerror/',
			},
			tag,
			InvalidSignatureError.code,
		)
	}
}
