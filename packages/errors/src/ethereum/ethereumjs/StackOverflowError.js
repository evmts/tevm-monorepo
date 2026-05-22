// StackOverflowError.js
import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a StackOverflowError.
 * @typedef {Object} StackOverflowErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode error that occurs when there is a stack overflow during execution.
 * This error is typically encountered when an operation causes the stack to exceed its limit.
 *
 * Stack overflow errors can occur due to:
 * - Excessive recursion leading to too many function calls.
 * - Bugs in smart contract logic that cause infinite loops or excessive stack usage.
 * - Incorrect management of stack operations (e.g., pushing too many items onto the stack).
 *
 * To debug a stack overflow error:
 * 1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles recursion and stack operations.
 * 2. **Optimize Stack Usage**: Refactor your code to reduce stack usage, such as minimizing the depth of recursive calls.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
 * 4. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation that can throw a StackOverflowError
 * } catch (error) {
 *   if (error instanceof StackOverflowError) {
 *     console.error(error.message);
 *     // Handle the stack overflow error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Stack overflow error occurred.'] - A human-readable error message.
 * @param {StackOverflowErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class StackOverflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STACK_OVERFLOW
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {StackOverflowErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Stack overflow error occurred.', args = {}, tag = 'StackOverflowError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/stackoverflowerror/',
			},
			tag,
		)
	}
}
