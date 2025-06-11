import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidSaltError.
 * @typedef {Object} InvalidSaltErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the salt parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a salt parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidSaltError
 * } catch (error) {
 *   if (error instanceof InvalidSaltError) {
 *     console.error(error.message);
 *     // Handle the invalid salt error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidSaltErrorParameters} [args={}] - Additional parameters for the InvalidSaltError.
 * @property {'InvalidSaltError'} _tag - Same as name, used internally.
 * @property {'InvalidSaltError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidSaltError extends InvalidParamsError {
	/**
	 * Constructs an InvalidSaltError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidSaltErrorParameters} [args={}] - Additional parameters for the InvalidSaltError.
	 * @param {string} [tag='InvalidSaltError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidSaltError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidsalterror/',
			},
			tag,
		)

	}

	/**
	 * @type {'InvalidSaltError'}
	 * @override
	 */
	_tag = 'InvalidSaltError'

	/**
	 * @type {'InvalidSaltError'}
	 * @override
	 */
	name = 'InvalidSaltError'
}
