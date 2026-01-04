// StackOverflowError.js
import { EVMError } from '../EVMError.js'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a StackOverflowError.
 * @typedef {Object} StackOverflowErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * - **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.
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
 * @property {'StackOverflowError'} _tag - Same as name, used internally.
 * @property {'StackOverflowError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class StackOverflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STACK_OVERFLOW
	/**
	 * Constructs a StackOverflowError.
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
	 * - **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.
	 *
	 * @param {string} [message='Stack overflow error occurred.'] - Human-readable error message.
	 * @param {StackOverflowErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='StackOverflowError'] - The tag for the error.
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
