import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an AccountLockedError.
 * @typedef {Object} AccountLockedErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
