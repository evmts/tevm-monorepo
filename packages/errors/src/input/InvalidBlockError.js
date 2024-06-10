import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBlockError.
 * @typedef {Object} InvalidBlockErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the block parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a block, blockTag, or blockNumber parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidBlockError
 * } catch (error) {
 *   if (error instanceof InvalidBlockError) {
 *     console.error(error.message);
 *     // Handle the invalid block error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidBlockErrorParameters} [args={}] - Additional parameters for the InvalidBlockError.
 * @property {'InvalidBlockError'} _tag - Same as name, used internally.
 * @property {'InvalidBlockError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidBlockError extends InvalidParamsError {
	/**
	 * Constructs an InvalidBlockError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidBlockErrorParameters} [args={}] - Additional parameters for the InvalidBlockError.
	 */
	constructor(message, args = {}) {
		super(message, {
			...args,
			docsBaseUrl: 'https://tevm.sh',
			docsPath: '/reference/tevm/errors/classes/invalidblockerror/',
		})

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
