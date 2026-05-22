import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a StackUnderflowError.
 * @typedef {Object} StackUnderflowErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents a contract/bytecode error that occurs when there is a stack underflow during execution.
 * This error is typically encountered when an operation requires more stack items than are present.
 *
 * Stack underflow errors can occur due to:
 * - Incorrect management of stack operations (e.g., popping more items than available).
 * - Bugs in smart contract logic leading to unexpected stack behavior.
 * - Issues with function calls that manipulate the stack incorrectly.
 *
 * To debug a stack underflow error:
 * 1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles stack operations, especially in loops and conditional branches.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
 * 3. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation that can throw a StackUnderflowError
 * } catch (error) {
 *   if (error instanceof StackUnderflowError) {
 *     console.error(error.message);
 *     // Handle the stack underflow error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Stack underflow error occurred.'] - A human-readable error message.
 * @param {StackUnderflowErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class StackUnderflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STACK_UNDERFLOW
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {StackUnderflowErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Stack underflow error occurred.', args = {}, tag = 'StackUnderflowError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/stackunderflowerror/',
			},
			tag,
		)
	}
}
