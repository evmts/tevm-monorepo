import { BaseError } from '../ethereum/BaseError.js'

/**
 * Parameters for constructing an InvalidMaxFeePerGasError.
 * @typedef {import('../ethereum/BaseError.js').BaseErrorParameters} InvalidMaxFeePerGasErrorParameters
 */

/**
 * Represents an error that occurs when the max fee per gas is invalid.
 *
 * This error is typically encountered when a transaction specifies an invalid max fee per gas value.
 *
 * @example
 * ```javascript
 * import { InvalidMaxFeePerGasError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     from: '0x1234567890123456789012345678901234567890',
 *     to: '0x0987654321098765432109876543210987654321',
 *     maxFeePerGas: -1n, // Invalid negative max fee per gas
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidMaxFeePerGasError) {
 *     console.error('Invalid max fee per gas:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class InvalidMaxFeePerGasError extends BaseError {
	/**
	 * Constructs an InvalidMaxFeePerGasError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidMaxFeePerGasErrorParameters} [args={}] - Additional parameters for the InvalidMaxFeePerGasError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidmaxfeepergaserror/',
			},
			'InvalidMaxFeePerGasError',
		)
	}
}
