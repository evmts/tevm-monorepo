import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an UnknownBlockError.
 * @typedef {Object} UnknownBlockErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
