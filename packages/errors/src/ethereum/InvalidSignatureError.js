// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidSignatureError.
 * @typedef {Object} InvalidSignatureErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InvalidSignature'} _tag - Same as name, used internally.
 * @property {'InvalidSignature'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
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

	/**
	 * @type {'InvalidSignature'}
	 * @override
	 */
	_tag = 'InvalidSignature'

	/**
	 * @type {'InvalidSignature'}
	 * @override
	 */
	name = 'InvalidSignature'
}
