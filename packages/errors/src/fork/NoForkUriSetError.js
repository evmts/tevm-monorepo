import { BaseError } from '../ethereum/index.js'

/**
 * Parameters for constructing an NoForkTransportSetError.
 * @typedef {Object} NoForkTransportSetErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Error represents the tevm client attempted to fetch a resource from a Forked transport but no transport was set.
 * To set a transport use the `fork.transport` option for [`createMemoryClient`](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
 *
 * @param {string} message - A human-readable error message.
 * @param {NoForkTransportSetErrorParameters} [args={}] - Additional parameters for the InvalidParamsError.
 * @property {'NoForkTransportSetError'} _tag - Same as name, used internally.
 * @property {'NoForkTransportSetError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class NoForkTransportSetError extends BaseError {
	/**
	 * Constructs an NoForkTransportSetError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NoForkTransportSetErrorParameters} [args={}] - Additional parameters to pass to BaseError.
	 */
	constructor(message, args = {}) {
		super(message, {
			...args,
			docsBaseUrl: 'https://tevm.sh',
			docsPath: '/reference/tevm/errors/classes/noforktransportseterror/',
		})

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
