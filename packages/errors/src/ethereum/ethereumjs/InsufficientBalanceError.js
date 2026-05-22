import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InsufficientBalanceError}.
 * @typedef {Object} InsufficientBalanceErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when an account has insufficient balance to perform a transaction.
 * EVM transaction execution metadata level error
 *
 * Insufficient balance errors can occur due to:
 * - Attempting to transfer or spend more funds than available in the account.
 *
 * To debug an insufficient balance error:
 * 1. **Review Account Balance**: Ensure that the account has sufficient funds to cover the transaction.
 * 2. **Check Transaction Details**: Verify the transaction amount and ensure it does not exceed the account balance.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction execution and identify where the insufficient balance occurs.
 *
 * @example
 * ```typescript
 * import { InsufficientBalanceError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InsufficientBalanceError
 * } catch (error) {
 *   if (error instanceof InsufficientBalanceError) {
 *     console.error(error.message);
 *     // Handle the insufficient balance error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Insufficient balance error occurred.'] - A human-readable error message.
 * @param {InsufficientBalanceErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InsufficientBalanceError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INSUFFICIENT_BALANCE
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InsufficientBalanceErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Insufficient balance error occurred.', args = {}, tag = 'InsufficientBalanceError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/insufficientbalanceerror/',
			},
			tag,
		)
	}
}
