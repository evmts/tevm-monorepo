import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InsufficientBalanceError}.
 * @typedef {Object} InsufficientBalanceErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InsufficientBalanceError'} _tag - Same as name, used internally.
 * @property {'InsufficientBalanceError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InsufficientBalanceError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.INSUFFICIENT_BALANCE
	/**
	 * Constructs an InsufficientBalanceError.
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
	 * @param {string} [message='Insufficient balance error occurred.'] - Human-readable error message.
	 * @param {InsufficientBalanceErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InsufficientBalanceError'] - The tag for the error.
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
