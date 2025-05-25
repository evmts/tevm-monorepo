import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link ValueOverflowError}.
 * @typedef {Object} ValueOverflowErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'ValueOverflowError'} _tag - Same as name, used internally.
 * @property {'ValueOverflowError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ValueOverflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.VALUE_OVERFLOW
	/**
	 * Constructs a ValueOverflowError.
	 * Represents an invalid bytecode/contract error that occurs when a value overflow happens during EVM execution.
	 *
	 * Value overflow errors can occur due to:
	 * - Arithmetic operations that exceed the maximum value limit.
	 *
	 * To debug a value overflow error:
	 * 1. **Review Arithmetic Operations**: Ensure that arithmetic operations are correctly handling large numbers and preventing overflow.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the overflow occurs.
	 *
	 * @param {string} [message='Value overflow error occurred.'] - Human-readable error message.
	 * @param {ValueOverflowErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ValueOverflowError'] - The tag for the error.
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
