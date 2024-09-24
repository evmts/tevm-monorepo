// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InsufficientPermissionsError.
 * @typedef {Object} InsufficientPermissionsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when there are insufficient permissions for a requested operation.
 *
 * This error is typically encountered when an action is attempted without the necessary permissions.
 *
 * @example
 * try {
 *   // Some operation that can throw an InsufficientPermissionsError
 * } catch (error) {
 *   if (error instanceof InsufficientPermissionsError) {
 *     console.error(error.message);
 *     // Handle the insufficient permissions error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InsufficientPermissionsErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InsufficientPermissions'} _tag - Same as name, used internally.
 * @property {'InsufficientPermissions'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InsufficientPermissionsError extends BaseError {
	/**
	 * The error code for InsufficientPermissionsError.
	 * @type {number}
	 */
	static code = -32009

	/**
	 * Constructs an InsufficientPermissionsError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InsufficientPermissionsErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InsufficientPermissions'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InsufficientPermissions') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/insufficientpermissionserror/',
			},
			tag,
			InsufficientPermissionsError.code,
		)
	}
}
