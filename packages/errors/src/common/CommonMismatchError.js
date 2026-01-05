import { ExecutionError } from '../ethereum/ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link CommonMismatchError}.
 * @typedef {Object} CommonMismatchErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('../ethereum/EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the Common for a given block does not match the Common of the VM.
 *
 * Common mismatch errors can occur due to:
 * - Discrepancies between the Common configurations for a block and the VM.
 * - Attempting to use features from a different hardfork than what's configured.
 *
 * @example
 * ```typescript
 * import { CommonMismatchError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { Hardfork } from '@tevm/common'
 *
 * const client = createMemoryClient({ hardfork: Hardfork.Shanghai })
 *
 * try {
 *   await client.setChain({ hardfork: Hardfork.London })
 *   // This might throw a CommonMismatchError if the operation is incompatible
 * } catch (error) {
 *   if (error instanceof CommonMismatchError) {
 *     console.error('Common mismatch:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *     // Handle the common mismatch error, possibly by updating the client configuration
 *   }
 * }
 * ```
 *
 * @extends {ExecutionError}
 */
export class CommonMismatchError extends ExecutionError {
	/**
	 * Constructs a CommonMismatchError.
	 *
	 * @param {string} [message='Common mismatch error occurred.'] - Human-readable error message.
	 * @param {CommonMismatchErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message = 'Common mismatch error occurred.', args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/commonmismatcherror/',
			},
			'CommonMismatchError',
		)
	}
}
