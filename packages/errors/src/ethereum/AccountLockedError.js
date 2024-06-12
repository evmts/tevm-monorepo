// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an AccountLockedError.
 * @typedef {Object} AccountLockedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when an account is locked.
 *
 * This error is typically encountered when an operation is attempted on an account
 * that has been locked for security reasons. This might happen if the account has
 * been temporarily disabled or if additional authentication is required.
 *
 * @example
 * try {
 *   // Some operation that can throw an AccountLockedError
 * } catch (error) {
 *   if (error instanceof AccountLockedError) {
 *     console.error(error.message);
 *     // Handle the account locked error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {AccountLockedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'AccountLocked'} _tag - Same as name, used internally.
 * @property {'AccountLocked'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AccountLockedError extends BaseError {
	/**
	 * Constructs an AccountLockedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {AccountLockedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/accountlockederror/',
			},
			'AccountLocked',
			-32005,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'AccountLocked'}
	 * @override
	 */
	_tag = 'AccountLocked'

	/**
	 * @type {'AccountLocked'}
	 * @override
	 */
	name = 'AccountLocked'
}
