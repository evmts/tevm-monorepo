import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link StaticStateChangeError}.
 * @typedef {Object} StaticStateChangeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when a state-changing operation is attempted in a static context.
 * This error is typically encountered when a contract attempts to modify the state during a static call.
 *
 * Static state change errors can occur due to:
 * - Attempting to modify the state in a static call.
 * - Executing state-changing operations in a read-only context.
 * - Bugs in the smart contract code leading to unintended state changes.
 *
 * To debug a static state change error:
 * 1. **Review Contract Logic**: Ensure that state-changing operations are not executed in static calls or read-only contexts.
 * 2. **Check Function Modifiers**: Verify that the function modifiers and visibility settings are correctly applied to prevent state changes in static contexts.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the state change is attempted in a static context.
 * 4. **Inspect Contract Code**: Manually inspect the contract code to ensure that state changes are correctly controlled and executed only in appropriate contexts.
 *
 * @example
 * ```typescript
 * import { StaticStateChangeError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a StaticStateChangeError
 * } catch (error) {
 *   if (error instanceof StaticStateChangeError) {
 *     console.error(error.message);
 *     // Handle the static state change error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Static state change error occurred.'] - A human-readable error message.
 * @param {StaticStateChangeErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'StaticStateChangeError'} _tag - Same as name, used internally.
 * @property {'StaticStateChangeError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class StaticStateChangeError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STATIC_STATE_CHANGE
	/**
	 * Constructs a StaticStateChangeError.
	 * Represents an invalid bytecode/contract error that occurs when a state-changing operation is attempted in a static context.
	 * This error is typically encountered when a contract attempts to modify the state during a static call.
	 *
	 * Static state change errors can occur due to:
	 * - Attempting to modify the state in a static call.
	 * - Executing state-changing operations in a read-only context.
	 * - Bugs in the smart contract code leading to unintended state changes.
	 *
	 * To debug a static state change error:
	 * 1. **Review Contract Logic**: Ensure that state-changing operations are not executed in static calls or read-only contexts.
	 * 2. **Check Function Modifiers**: Verify that the function modifiers and visibility settings are correctly applied to prevent state changes in static contexts.
	 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the state change is attempted in a static context.
	 * 4. **Inspect Contract Code**: Manually inspect the contract code to ensure that state changes are correctly controlled and executed only in appropriate contexts.
	 *
	 * @param {string} [message='Static state change error occurred.'] - Human-readable error message.
	 * @param {StaticStateChangeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='StaticStateChangeError'] - The tag for the error.
	 */
	constructor(message = 'Static state change error occurred.', args = {}, tag = 'StaticStateChangeError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/staticstatechangeerror/',
			},
			tag,
		)
	}
}
