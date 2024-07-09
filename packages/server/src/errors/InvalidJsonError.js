import { BaseError } from '@tevm/errors'

/**
 * Parameters for constructing an {@link InvalidJsonError}.
 * @typedef {Object} InvalidJsonErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('@tevm/errors').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when parsing JSON fails.
 *
 * This error is typically encountered when there is an issue with the JSON structure, such as a syntax error or malformed JSON.
 *
 * @example
 * try {
 *   const data = parseJsonWithSomeTevmMethod(someString)
 * } catch (error) {
 *   if (error instanceof InvalidJsonError) {
 *     console.error(error.message);
 *     // Handle the invalid JSON error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidJsonErrorParameters} [args={}] - Additional parameters for the InvalidJsonError.
 * @property {'InvalidJsonError'} _tag - Same as name, used internally.
 * @property {'InvalidJsonError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidJsonError extends BaseError {
	/**
	 * Constructs an InvalidJsonError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidJsonErrorParameters} [args={}] - Additional parameters for the InvalidJsonError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidjsonerror/',
			},
			'InvalidJsonError',
		)
	}
}
