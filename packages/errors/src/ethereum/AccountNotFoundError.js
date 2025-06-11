import { ResourceNotFoundError } from './ResourceNotFoundError.js'

/**
 * Parameters for constructing an AccountNotFoundError.
 * @typedef {Object} AccountNotFoundErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('./BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'AccountNotFoundError'} _tag - Same as name, used internally.
 * @property {'AccountNotFoundError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class AccountNotFoundError extends ResourceNotFoundError {
	/**
	 * Constructs an AccountNotFoundError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {AccountNotFoundErrorParameters} [args={}] - Additional parameters for the ResourceNotFoundError.
	 * @param {string} [tag='AccountNotFoundError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'AccountNotFoundError') {
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

	/**
	 * @type {'AccountNotFoundError'}
	 * @override
	 */
	_tag = 'AccountNotFoundError'

	/**
	 * @type {'AccountNotFoundError'}
	 * @override
	 */
	name = 'AccountNotFoundError'
}
