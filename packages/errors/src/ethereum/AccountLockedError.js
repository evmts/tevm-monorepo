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
 * been temporarily disabled, if additional authentication is required, or if the
 * account's private key is not available to the node.
 *
 * The error code -32005 is a non-standard extension used by some Ethereum clients to
 * indicate this specific condition.
 *
 * @example
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     value: '0x1'
 *   })
 * } catch (error) {
 *   if (error instanceof AccountLockedError) {
 *     console.error('Account locked:', error.message);
 *     console.log('Unlock the account or use a different account for this transaction');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {AccountLockedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32020), a non-standard extension for this specific error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AccountLockedError extends BaseError {
	/**
	 * The error code for AccountLockedError.
	 * @type {number}
	 */
	static code = -32020

	/**
	 * Constructs an AccountLockedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {AccountLockedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='AccountLocked'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'AccountLocked') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/accountlockederror/',
			},
			tag,
			AccountLockedError.code,
		)
	}
}
