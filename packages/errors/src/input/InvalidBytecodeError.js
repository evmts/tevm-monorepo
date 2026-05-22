import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBytecodeError.
 * @typedef {Object} InvalidBytecodeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the bytecode parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a bytecode parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidBytecodeError
 * } catch (error) {
 *   if (error instanceof InvalidBytecodeError) {
 *     console.error(error.message);
 *     // Handle the invalid bytecode error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidBytecodeErrorParameters} [args={}] - Additional parameters for the InvalidBytecodeError.
 */
export class InvalidBytecodeError extends InvalidParamsError {
	/**
	 * Constructs an InvalidBytecodeError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidBytecodeErrorParameters} [args={}] - Additional parameters for the InvalidBytecodeError.
	 * @param {string} [tag='InvalidBytecodeError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InvalidBytecodeError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidbytecodeerror/',
			},
			tag,
		)
	}
}
