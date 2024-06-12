import { ExecutionError } from '../ethereum/ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link EipNotEnabledError}.
 * @typedef {Object} EipNotEnabledErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when an EIP (Ethereum Improvement Proposal) is not enabled.
 *
 * EIP not enabled errors can occur due to:
 * - Attempting to use features or operations that require a specific EIP which is not enabled in the VM.
 *
 * EIPs can be set on common and passed into createMemoryClient
 *
 * @example
 * ```typescript
 * import { EipNotEnabledError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an EipNotEnabledError
 * } catch (error) {
 *   if (error instanceof EipNotEnabledError) {
 *     console.error(error.message);
 *     // Handle the EIP not enabled error
 *   }
 * }
 * ```
 *
 * @param {string} [message='EIP not enabled error occurred.'] - A human-readable error message.
 * @param {EipNotEnabledErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'EipNotEnabledError'} _tag - Same as name, used internally.
 * @property {'EipNotEnabledError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class EipNotEnabledError extends ExecutionError {
	/**
	 * Constructs an EipNotEnabledError.
	 *
	 * @param {string} [message='EIP not enabled error occurred.'] - Human-readable error message.
	 * @param {EipNotEnabledErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'EIP not enabled error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/eipnotenablederror/',
		})

		/**
		 * @type {string}
		 * @override
		 */
		this.message = message

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
		/**
		 * @type {'EipNotEnabledError'}
		 */
		this._tag = 'EipNotEnabledError'
	}
}
