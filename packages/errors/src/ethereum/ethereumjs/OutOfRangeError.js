import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link OutOfRangeError}.
 * @typedef {Object} OutOfRangeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode/contract error that occurs when a value is out of the allowable range during EVM execution.
 * This error is typically encountered when an operation results in a value that exceeds the allowed limits.
 *
 * Value out of range errors can occur due to:
 * - Arithmetic operations that result in overflow or underflow.
 * - Incorrect handling of large numbers in the smart contract code.
 * - Bugs in the smart contract code causing values to exceed their expected range.
 *
 * To debug a value out of range error:
 * 1. **Review Arithmetic Operations**: Ensure that arithmetic operations in the contract are correctly handling large numbers and preventing overflow/underflow.
 * 2. **Check Value Assignments**: Verify that values assigned to variables are within the allowable range and properly validated.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the value goes out of range.
 * 4. **Inspect Contract Logic**: Manually inspect the contract code to ensure that all value assignments and operations are within the expected limits.
 *
 * @example
 * ```typescript
 * import { OutOfRangeError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an OutOfRangeError
 * } catch (error) {
 *   if (error instanceof OutOfRangeError) {
 *     console.error(error.message);
 *     // Handle the value out of range error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Value out of range error occurred.'] - A human-readable error message.
 * @param {OutOfRangeErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class OutOfRangeError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.OUT_OF_RANGE
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {OutOfRangeErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Value out of range error occurred.', args = {}, tag = 'OutOfRangeError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/outofrangeerror/',
			},
			tag,
		)
	}
}
