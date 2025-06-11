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
 * This error is typically encountered when a block hash or number is provided that does not correspond
 * to any block known to the node. This can happen if the block hasn't been mined yet, if it's on a
 * different chain, or if the node is not fully synced.
 *
 * The error code -32001 is a non-standard extension used by some Ethereum clients to
 * indicate this specific condition.
 *
 * @example
 * try {
 *   const block = await client.getBlock({
 *     blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
 *   })
 * } catch (error) {
 *   if (error instanceof UnknownBlockError) {
 *     console.error('Unknown block:', error.message);
 *     console.log('The specified block does not exist or is not available to this node');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {UnknownBlockErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'UnknownBlock'} _tag - Same as name, used internally.
 * @property {'UnknownBlock'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32001), a non-standard extension for this specific error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class UnknownBlockError extends BaseError {
	/**
	 * The error code for UnknownBlockError.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Constructs an UnknownBlockError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {UnknownBlockErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='UnknownBlock'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'UnknownBlock') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/unknownblockerror/',
			},
			tag,
			UnknownBlockError.code,
		)
	}
}
