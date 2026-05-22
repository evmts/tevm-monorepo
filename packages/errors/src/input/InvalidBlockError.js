import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBlockError.
 * @typedef {Object} InvalidBlockErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the block parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a block, blockTag, or blockNumber parameter that is invalid or does not conform to the expected structure.
 *
 * Currently most named block tags are not supported on all endpoints except for `latest` and 'earliest'. This will be expanded in near future.
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
 */
export class InvalidBlockError extends InvalidParamsError {
	/**
	 * Constructs an InvalidBlockError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidBlockErrorParameters} [args={}] - Additional parameters for the InvalidBlockError.
	 * @param {string} [tag='InvalidBlockError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidBlockError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidblockerror/',
			},
			tag,
		)
	}
}
