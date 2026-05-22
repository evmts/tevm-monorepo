import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an InternalError.
 * @typedef {Object} InternalErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error|unknown} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an internal JSON-RPC error.
 *
 * This error is typically encountered when there is an unexpected internal error on the server.
 * It's a catch-all for errors that don't fall into more specific categories and usually indicates
 * a problem with the Ethereum node or the JSON-RPC server itself, rather than with the request.
 *
 * The error code -32603 is a standard JSON-RPC error code for internal errors.
 *
 * @example
 * try {
 *   await client.call({
 *     to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
 *     data: '0x...' // some method call
 *   })
 * } catch (error) {
 *   if (error instanceof InternalError) {
 *     console.error('Internal error:', error.message);
 *     console.log('This is likely a problem with the Ethereum node. Try again later or contact the node operator.');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {InternalErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InternalError extends BaseError {
	/**
	 * The error code for InternalError.
	 * @type {number}
	 */
	static code = -32603

	/**
	 * Constructs an InternalError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InternalErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InternalError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'InternalError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/internalerror/',
			},
			tag,
			InternalError.code,
		)

		this.meta = args.meta
	}
}
