import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidOpcodeError}.
 * @typedef {Object} InvalidOpcodeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid opcode is encountered during EVM execution.
 * This error is typically encountered when the bytecode contains an opcode that is not recognized by the EVM.
 *
 * Invalid opcode errors can occur due to:
 * - Typographical errors in the bytecode.
 * - Using opcodes that are not supported by the selected EVM version or hardfork.
 *
 * To debug an invalid opcode error:
 * 1. **Review Bytecode**: Ensure that the bytecode provided is correct and does not contain any invalid opcodes.
 * 2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the opcodes used by your contract.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid opcode is encountered.
 * 4. **Inspect Contract Code**: Manually inspect the contract code to ensure it compiles correctly and does not include any invalid opcodes.
 *
 * @example
 * ```typescript
 * import { InvalidOpcodeError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidOpcodeError
 * } catch (error) {
 *   if (error instanceof InvalidOpcodeError) {
 *     console.error(error.message);
 *     // Handle the invalid opcode error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid opcode error occurred.'] - A human-readable error message.
 * @param {InvalidOpcodeErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidOpcodeError'} _tag - Same as name, used internally.
 * @property {'InvalidOpcodeError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidOpcodeError extends ExecutionError {
	/** @type {string} */	static EVMErrorMessage = EVMError.errorMessages.INVALID_OPCODE
	/**
	 * Constructs an InvalidOpcodeError.
	 * Represents an invalid bytecode/contract error that occurs when an invalid opcode is encountered during EVM execution.
	 * This error is typically encountered when the bytecode contains an opcode that is not recognized by the EVM.
	 *
	 * Invalid opcode errors can occur due to:
	 * - Typographical errors in the bytecode.
	 * - Using opcodes that are not supported by the selected EVM version or hardfork.
	 *
	 * To debug an invalid opcode error:
	 * 1. **Review Bytecode**: Ensure that the bytecode provided is correct and does not contain any invalid opcodes.
	 * 2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the opcodes used by your contract.
	 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid opcode is encountered.
	 * 4. **Inspect Contract Code**: Manually inspect the contract code to ensure it compiles correctly and does not include any invalid opcodes.
	 *
	 * @param {string} [message='Invalid opcode error occurred.'] - Human-readable error message.
	 * @param {InvalidOpcodeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidOpcodeError'] - The tag for the error.}
	 */
	constructor(message = 'Invalid opcode error occurred.', args = {}, tag = 'InvalidOpcodeError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidopcodeerror/',
			},
			tag,
		)
	}
}
