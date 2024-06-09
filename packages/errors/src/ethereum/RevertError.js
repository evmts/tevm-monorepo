// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a RevertError.
 * @typedef {Object} RevertErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a transaction execution is reverted.
 *
 * This error is typically encountered when a transaction or contract execution is reverted by the EVM.
 *
 * @example
 * try {
 *   // Some operation that can throw a RevertError
 * } catch (error) {
 *   if (error instanceof RevertError) {
 *     console.error(error.message);
 *     // Handle the revert error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {RevertErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'Revert'} _tag - Same as name, used internally.
 * @property {'Revert'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class RevertError extends BaseError {
	/**
	 * Constructs a RevertError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {RevertErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/reverterror/',
			},
			'Revert',
			-32000,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'Revert'}
	 * @override
	 */
	_tag = 'Revert'

	/**
	 * @type {'Revert'}
	 * @override
	 */
	name = 'Revert'
}
