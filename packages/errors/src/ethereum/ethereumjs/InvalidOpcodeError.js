import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidOpcodeError}.
 * @typedef {Object} InvalidOpcodeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidOpcodeError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_OPCODE
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidOpcodeErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
