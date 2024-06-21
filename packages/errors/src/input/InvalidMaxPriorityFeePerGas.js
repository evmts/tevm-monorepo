import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidMaxPriorityFeePerGasError.
 * @typedef {Object} InvalidMaxPriorityFeePerGasErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the max priority fee per gas is invalid.
 *
 * This error is typically encountered when a transaction or operation references a max priority fee per gas that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidMaxPriorityFeePerGasError
 * } catch (error) {
 *   if (error instanceof InvalidMaxPriorityFeePerGasError) {
 *     console.error(error.message);
 *     // Handle the invalid max priority fee per gas error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidMaxPriorityFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxPriorityFeePerGasError.
 * @property {'InvalidMaxPriorityFeePerGasError'} _tag - Same as name, used internally.
 * @property {'InvalidMaxPriorityFeePerGasError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidMaxPriorityFeePerGasError extends InvalidParamsError {
	/**
	 * Constructs an InvalidMaxPriorityFeePerGasError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidMaxPriorityFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxPriorityFeePerGasError.
	 * @param {string} [tag='InvalidMaxPriorityFeePerGasError'] - The tag for the error.}
	 */
	constructor(message, args = {}, tag = 'InvalidMaxPriorityFeePerGasError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidmaxpriorityfeepergaserror/',
			},
			tag,
		)
	}
}
