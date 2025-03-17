import { BaseError } from '../ethereum/BaseError.js'

/**
 * Parameters for constructing an InvalidStateOverrideError.
 * @typedef {import('../ethereum/BaseError.js').BaseErrorParameters} InvalidStateOverrideErrorParameters
 */

/**
 * Represents an error that occurs when a state override parameter is invalid.
 *
 * This error is typically encountered when a state override entry in a call or transaction is invalid or malformed.
 *
 * @example
 * ```javascript
 * import { InvalidStateOverrideError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.call({
 *     to: '0x...',
 *     stateOverrideSet: {
 *       '0x1234567890123456789012345678901234567890': {
 *         balance: 'invalid', // Should be a bigint or hex string
 *       }
 *     }
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidStateOverrideError) {
 *     console.error('Invalid state override:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {BaseError}
 */
export class InvalidStateOverrideError extends BaseError {
	/**
	 * Constructs an InvalidStateOverrideError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidStateOverrideErrorParameters} [args={}] - Additional parameters for the InvalidStateOverrideError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidstateoverrideerror/',
			},
			'InvalidStateOverrideError',
		)
	}
}
