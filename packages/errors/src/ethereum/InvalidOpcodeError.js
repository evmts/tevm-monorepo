// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InvalidOpcodeError.
 * @typedef {Object} InvalidOpcodeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a transaction contains an invalid opcode.
 *
 * This error is typically encountered when a transaction is executed with an opcode that is not recognized by the Ethereum Virtual Machine (EVM).
 *
 * @example
 * try {
 *   // Some operation that can throw an InvalidOpcodeError
 * } catch (error) {
 *   if (error instanceof InvalidOpcodeError) {
 *     console.error(error.message);
 *     // Handle the invalid opcode error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InvalidOpcodeErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidOpcode'} _tag - Same as name, used internally.
 * @property {'InvalidOpcode'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidOpcodeError extends BaseError {
	/**
	 * Constructs an InvalidOpcodeError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidOpcodeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/invalidopcodeerror/',
			},
			'InvalidOpcode',
			-32000,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'InvalidOpcode'}
	 * @override
	 */
	_tag = 'InvalidOpcode'

	/**
	 * @type {'InvalidOpcode'}
	 * @override
	 */
	name = 'InvalidOpcode'
}
