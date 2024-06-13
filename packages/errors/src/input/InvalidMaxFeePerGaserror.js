import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidMaxFeePerGasError.
 * @typedef {Object} InvalidMaxFeePerGasErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the max fee per gas is invalid.
 *
 * This error is typically encountered when a transaction or operation references a max fee per gas that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidMaxFeePerGasError
 * } catch (error) {
 *   if (error instanceof InvalidMaxFeePerGasError) {
 *     console.error(error.message);
 *     // Handle the invalid max fee per gas error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidMaxFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxFeePerGasError.
 * @property {'InvalidMaxFeePerGasError'} _tag - Same as name, used internally.
 * @property {'InvalidMaxFeePerGasError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidMaxFeePerGasError extends InvalidParamsError {
	/**
	 * Constructs an InvalidMaxFeePerGasError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidMaxFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxFeePerGasError.
	 */
	constructor(message, args = {}) {
		super(message, {
			...args,
			docsBaseUrl: 'https://tevm.sh',
			docsPath: '/reference/tevm/errors/classes/invalidmaxfeepergaserror/',
		})

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
