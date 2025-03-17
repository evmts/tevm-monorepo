import { BaseError } from '../ethereum/BaseError.js'

/**
 * Parameters for constructing an InvalidMaxPriorityFeePerGasError.
 * @typedef {import('../ethereum/BaseError.js').BaseErrorParameters} InvalidMaxPriorityFeePerGasErrorParameters
 */

/**
 * Represents an error that occurs when the max priority fee per gas is invalid.
 *
 * This error is typically encountered when a transaction specifies an invalid max priority fee per gas value.
 *
 * @example
 * ```javascript
 * import { InvalidMaxPriorityFeePerGasError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     maxPriorityFeePerGas: -1n, // Invalid negative max priority fee per gas
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidMaxPriorityFeePerGasError) {
 *     console.error('Invalid max priority fee per gas:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class InvalidMaxPriorityFeePerGasError extends BaseError {
	/**
	 * Constructs an InvalidMaxPriorityFeePerGasError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidMaxPriorityFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxPriorityFeePerGasError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidmaxpriorityfeepergaserror/',
			},
			'InvalidMaxPriorityFeePerGasError',
		)
	}
}
