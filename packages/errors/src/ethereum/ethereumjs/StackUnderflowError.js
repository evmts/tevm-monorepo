import { EVMError } from '../EVMError.js'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a StackUnderflowError.
 * @typedef {Object} StackUnderflowErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * - **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.
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
 * @property {'StackUnderflowError'} _tag - Same as name, used internally.
 * @property {'StackUnderflowError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class StackUnderflowError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.STACK_UNDERFLOW
	/**
	 * Constructs a StackUnderflowError.
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
	 * - **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.
	 *
	 * @param {string} [message='Stack underflow error occurred.'] - Human-readable error message.
	 * @param {StackUnderflowErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='StackUnderflowError'] - The tag for the error.
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
