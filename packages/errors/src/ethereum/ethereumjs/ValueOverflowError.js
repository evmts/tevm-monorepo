import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link ValueOverflowError}.
 * @typedef {Object} ValueOverflowErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode/contract error that occurs when a value overflow happens during EVM execution.
 *
 * Value overflow errors can occur due to:
 * - Arithmetic operations that exceed the maximum value limit.
 *
 * To debug a value overflow error:
 * 1. **Review Arithmetic Operations**: Ensure that arithmetic operations are correctly handling large numbers and preventing overflow.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the overflow occurs.
 *
 * @example
 * ```typescript
 * import { ValueOverflowError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a ValueOverflowError
 * } catch (error) {
 *   if (error instanceof ValueOverflowError) {
 *     console.error(error.message);
 *     // Handle the value overflow error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Value overflow error occurred.'] - A human-readable error message.
 * @param {ValueOverflowErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class ValueOverflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.VALUE_OVERFLOW
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {ValueOverflowErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Value overflow error occurred.', args = {}, tag = 'ValueOverflowError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/valueoverflowerror/',
			},
			tag,
		)
	}
}
