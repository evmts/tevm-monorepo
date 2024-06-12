import { EVMErrorMessage } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link RefundExhaustedError}.
 * @typedef {Object} RefundExhaustedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the gas refund limit is exhausted.
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
 * @property {'RefundExhaustedError'} _tag - Same as name, used internally.
 * @property {'RefundExhaustedError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class RefundExhaustedError extends ExecutionError {
	static EVMErrorMessage = EVMErrorMessage.REFUND_EXHAUSTED
	/**
	 * Constructs a RefundExhaustedError.
	 *
	 * @param {string} [message='Refund exhausted error occurred.'] - Human-readable error message.
	 * @param {RefundExhaustedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'Refund exhausted error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/refundexhaustederror/',
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
		 * @type {'RefundExhaustedError'}
		 */
		this._tag = 'RefundExhaustedError'
	}
}
