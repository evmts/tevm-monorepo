// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an UnknownBlockError.
 * @typedef {Object} UnknownBlockErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the specified block could not be found.
 *
 * This error is typically encountered when a block hash or number is provided that does not correspond to any block known to the node.
 *
 * @example
 * try {
 *   // Some operation that can throw an UnknownBlockError
 * } catch (error) {
 *   if (error instanceof UnknownBlockError) {
 *     console.error(error.message);
 *     // Handle the unknown block error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {UnknownBlockErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'UnknownBlock'} _tag - Same as name, used internally.
 * @property {'UnknownBlock'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class UnknownBlockError extends BaseError {
	/**
	 * Constructs an UnknownBlockError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {UnknownBlockErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/unknownblockerror/',
			},
			'UnknownBlock',
			-32001,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}

	/**
	 * @type {'UnknownBlock'}
	 * @override
	 */
	_tag = 'UnknownBlock'

	/**
	 * @type {'UnknownBlock'}
	 * @override
	 */
	name = 'UnknownBlock'
}
