import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link StaticStateChangeError}.
 * @typedef {Object} StaticStateChangeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class StaticStateChangeError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STATIC_STATE_CHANGE
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {StaticStateChangeErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
