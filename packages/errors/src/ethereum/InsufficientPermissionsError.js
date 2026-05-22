// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InsufficientPermissionsError.
 * @typedef {Object} InsufficientPermissionsErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
