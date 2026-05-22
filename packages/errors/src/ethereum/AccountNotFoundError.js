import { ResourceNotFoundError } from './ResourceNotFoundError.js'

/**
 * Parameters for constructing an AccountNotFoundError.
 * @typedef {Object} AccountNotFoundErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('./BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when an account cannot be found in the state.
 *
 * This error is typically encountered when a transaction or operation references an account that does not exist in the blockchain state.
 *
 * @example
 * try {
 *   // Some operation that can throw an AccountNotFoundError
 * } catch (error) {
 *   if (error instanceof AccountNotFoundError) {
 *     console.error(error.message);
 *     // Handle the account not found error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {AccountNotFoundErrorParameters} [args={}] - Additional parameters for the ResourceNotFoundError.
 */
export class AccountNotFoundError extends ResourceNotFoundError {
	/**
	 * Constructs an AccountNotFoundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {AccountNotFoundErrorParameters} [args={}] - Additional parameters for the ResourceNotFoundError.
	 * @param {string} [tag='AccountNotFound'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'AccountNotFound') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/accountnotfounderror/',
			},
			tag,
		)
	}
}
