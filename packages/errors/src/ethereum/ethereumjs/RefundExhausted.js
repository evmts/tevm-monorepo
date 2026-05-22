import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link RefundExhaustedError}.
 * @typedef {Object} RefundExhaustedErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode error that occurs when the gas refund limit is exhausted.
 * EVM transaction execution metadata level error
 *
 * Refund exhausted errors can occur due to:
 * - The transaction exceeding the gas refund limit.
 *
 * To debug a refund exhausted error:
 * 1. **Review Gas Usage**: Ensure that the gas usage in the contract is within the refund limits.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify excessive gas usage.
 *
 * @example
 * ```typescript
 * import { RefundExhaustedError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a RefundExhaustedError
 * } catch (error) {
 *   if (error instanceof RefundExhaustedError) {
 *     console.error(error.message);
 *     // Handle the refund exhausted error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Refund exhausted error occurred.'] - A human-readable error message.
 * @param {RefundExhaustedErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class RefundExhaustedError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.REFUND_EXHAUSTED
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {RefundExhaustedErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Refund exhausted error occurred.', args = {}, tag = 'RefundExhaustedError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/refundexhaustederror/',
			},
			tag,
		)
	}
}
