// Ideally we get this from viem
import { BaseError } from '../ethereum/BaseError.js'
import { ResourceNotFoundError } from '../ethereum/ResourceNotFoundError.js'

/**
 * Parameters for constructing a ForkError.
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
 *
 * @example
 * ```javascript
 * import { ForkError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient({
 *   fork: {
 *     url: 'https://mainnet.example.com'
 *   }
 * })
 *
 * try {
 *   await client.getBalance({ address: '0x...' })
 * } catch (error) {
 *   if (error instanceof ForkError) {
 *     console.error('Fork error:', error.message)
 *     console.log('Error code:', error.code)
 *     console.log('Documentation:', error.docsLink)
 *     // Handle the fork error, e.g., by retrying or using a different RPC endpoint
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class ForkError extends BaseError {
	/**
	 * Constructs a ForkError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ForkErrorParameters} args - Additional parameters for the error.
	 */
	constructor(message, args) {
		const cause =
			args.cause instanceof Error
				? args.cause
				: new BaseError(args.cause.message, {}, 'unknown', Number(args.cause.code))

		super(
			[message, cause.message].filter(Boolean).join('\n'),
			{
				...args,
				cause,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/forkerror/',
			},
			'ForkError',
			'code' in args.cause ? Number(args.cause.code) : new ResourceNotFoundError('').code,
		)

		this.name = 'ForkError'
		this._tag = 'ForkError'
	}
}
