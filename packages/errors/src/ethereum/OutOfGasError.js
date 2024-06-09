// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an OutOfGasError.
 * @typedef {Object} OutOfGasErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a transaction runs out of gas.
 *
 * This error is typically encountered when a transaction or contract execution exceeds the gas limit provided.
 *
 * @example
 * try {
 *   // Some operation that can throw an OutOfGasError
 * } catch (error) {
 *   if (error instanceof OutOfGasError) {
 *     console.error(error.message);
 *     // Handle the out of gas error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {OutOfGasErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'OutOfGas'} _tag - Same as name, used internally.
 * @property {'OutOfGas'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class OutOfGasError extends BaseError {
	/**
	 * Constructs an OutOfGasError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {OutOfGasErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/outofgaserror/',
			},
			'OutOfGas',
			-32000,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'OutOfGas'}
	 * @override
	 */
	_tag = 'OutOfGas'

	/**
	 * @type {'OutOfGas'}
	 * @override
	 */
	name = 'OutOfGas'
}
