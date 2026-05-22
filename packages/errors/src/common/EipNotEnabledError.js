import { ExecutionError } from '../ethereum/ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link EipNotEnabledError}.
 * @typedef {Object} EipNotEnabledErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when an EIP (Ethereum Improvement Proposal) is not enabled.
 *
 * EIP not enabled errors can occur due to:
 * - Attempting to use features or operations that require a specific EIP which is not enabled in the VM.
 *
 * @example
 * ```typescript
 * import { EipNotEnabledError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { Hardfork } from '@tevm/common'
 *
 * const client = createMemoryClient({ hardfork: Hardfork.London })
 *
 * try {
 *   // Attempt an operation that requires an EIP not enabled in London
 *   await client.call({
 *     to: '0x...',
 *     data: '0x...',
 *     // Assuming this operation requires a post-London EIP
 *   })
 * } catch (error) {
 *   if (error instanceof EipNotEnabledError) {
 *     console.error('EIP not enabled:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *     // Handle the error, possibly by updating the client to a newer hardfork
 *   }
 * }
 * ```
 *
 * @extends {ExecutionError}
 */
export class EipNotEnabledError extends ExecutionError {
	/**
	 * Constructs an EipNotEnabledError.
	 *
	 * @param {string} [message='EIP not enabled error occurred.'] - Human-readable error message.
	 * @param {EipNotEnabledErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message = 'EIP not enabled error occurred.', args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/eipnotenablederror/',
			},
			'EipNotEnabledError',
		)

		this.name = 'EipNotEnabledError'
		this._tag = 'EipNotEnabledError'
	}
}
