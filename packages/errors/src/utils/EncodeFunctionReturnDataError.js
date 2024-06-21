import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Represents an error that occurs when encoding function data fails.
 * Not expected to be thrown because the initial validation
 * should have caught any errors and thrown more specific errors.
 *
 * @example
 * try {
 *   // Some operation that can throw an EncodeFunctionReturnDataError
 * } catch (error) {
 *   if (error instanceof EncodeFunctionReturnDataError) {
 *     console.error(error.message);
 *     // Handle the encode function return data error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {object} [meta] - Optional object containing additional information about the error.
 * @property {'EncodeFunctionReturnDataError'} _tag - Same as name, used internally.
 * @property {'EncodeFunctionReturnDataError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class EncodeFunctionReturnDataError extends InvalidParamsError {
	/**
	 * Constructs an EncodeFunctionReturnDataError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {object} [meta] - Optional object containing additional information about the error.
	 * @param {string} [tag='EncodeFunctionReturnDataError'] - The tag for the error.
	 */
	constructor(message, meta, tag = 'EncodeFunctionReturnDataError') {
		super(
			message,
			{
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/encodefunctionreturndataerror/',
				...meta,
			},
			tag,
		)
	}
}
