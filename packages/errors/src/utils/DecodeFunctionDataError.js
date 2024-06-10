import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Represents an error that occurs when decoding function data fails.
 * Not expected to be thrown unless ABI is incorrect.
 *
 * @example
 * const {errors} = await tevm.call({address: '0x1234'})
 * errors.forEach(error => {
 *   if (error.name === 'DecodeFunctionDataError') {
 *     console.log(error.message)
 *   }
 * })
 *
 * @param {string} message - A human-readable error message.
 * @param {object} [meta] - Optional object containing additional information about the error.
 * @property {'DecodeFunctionDataError'} _tag - Same as name, used internally.
 * @property {'DecodeFunctionDataError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class DecodeFunctionDataError extends InvalidParamsError {
	/**
	 * Constructs a DecodeFunctionDataError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {object} [meta] - Optional object containing additional information about the error.
	 */
	constructor(message, meta) {
		super(message, {
			docsBaseUrl: 'https://tevm.sh',
			docsPath: '/reference/tevm/errors/classes/decodefunctiondataerror/',
			...meta,
		})
	}
}
