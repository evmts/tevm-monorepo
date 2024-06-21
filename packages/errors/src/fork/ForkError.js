// Ideally we get this from viem
import { BaseError } from '../ethereum/BaseError.js'
import { ResourceNotFoundError } from '../ethereum/ResourceNotFoundError.js'

/**
 * Parameters for constructing an ForkError.
 * @typedef {Object} ForkErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error|{code: number | string, message: string}} cause - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error thrown when attempting to fetch a resource from a Forked transport.
 * If the underlying JSON-RPC call has an error code, the error code will be proxied to the ForkError.
 * Most tevm methods return these errors as values if `throwOnFail` is set to `false` and a forkUrl is provided
 *
 * @example
 * try {
 *   // Some operation that can throw an ForkError
 * } catch (error) {
 *   if (error instanceof ForkError) {
 *     console.error(error.message);
 *     // Handle the account locked error
 *   }
 * }
 *
 * To debug this error check to see if there might be a misconfiguration or rate limit of the
 * fork transport.
 *
 * If the issue is a rate limit consider using the `rateLimit` transport options to limit how many
 * requests tevm are made.
 * ```typescript
 * import { rateLimit, http } from "@tevm/jsonrpc"
 * import { createMemoryClient } from "@tevm/memory-client"
 *
 * const client = createMemoryClient({
 *   fork: {
 *     transport: rateLimit(
 *       http('https://mainnet.optimism.io'), { browser: false, requestsPerSecond: 25 }
 *     )
 *   )
 * }}
 * ```
 *
 * @param {string} message - A human-readable error message.
 * @param {ForkErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'Fork'} _tag - Same as name, used internally.
 * @property {'Fork'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ForkError extends BaseError {
	/**
	 * Constructs an ForkError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ForkErrorParameters} args - Additional parameters for the BaseError.
	 */
	constructor(message, args) {
		super(
			[message, ...('message' in args.cause ? [args.cause.message] : [])].join('\n'),
			{
				...args,
				cause:
					args.cause instanceof Error
						? args.cause
						: new BaseError(args.cause.message, {}, 'unknown', /** @type {number}*/ (args.cause.code)),
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/accountlockederror/',
			},
			'Fork',
			-32005,
		)

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta

		/**
		 * Proxy the code from underlying error if it exists, otherwise default to ResourceNotFoundError code.
		 * @type {number}
		 */
		this.code = 'code' in args.cause ? /** @type {number}*/ (args.cause.code) : new ResourceNotFoundError('').code
	}

	/**
	 * @type {'Fork'}
	 * @override
	 */
	_tag = 'Fork'

	/**
	 * @type {'Fork'}
	 * @override
	 */
	name = 'Fork'
}
