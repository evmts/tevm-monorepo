import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidJumpError}.
 * @typedef {Object} InvalidJumpErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid JUMP operation is executed within the EVM.
 * This error is typically encountered when the jump destination in the bytecode is invalid or does not exist.
 *
 * Invalid JUMP errors can occur due to:
 * - Incorrect jump destinations in the bytecode.
 * - Bugs in the smart contract code causing jumps to non-existent locations.
 * - Conditional logic errors leading to unexpected jump destinations.
 *
 * To debug an invalid JUMP error:
 * 1. **Double Check Bytecode**: Ensure that the bytecode provided is valid.
 * 2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the EVM version you are targeting.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid JUMP occurs.
 *
 * @example
 * ```typescript
 * import { InvalidJumpError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidJumpError
 * } catch (error) {
 *   if (error instanceof InvalidJumpError) {
 *     console.error(error.message);
 *     // Handle the invalid JUMP error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid JUMP error occurred.'] - A human-readable error message.
 * @param {InvalidJumpErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidJumpError'} _tag - Same as name, used internally.
 * @property {'InvalidJumpError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidJumpError extends ExecutionError {
	/** @type {string} */	static EVMErrorMessage = EVMError.errorMessages.INVALID_JUMP
	/**
	 * Constructs an InvalidJumpError.
	 * Represents an invalid bytecode/contract error that occurs when an invalid JUMP operation is executed within the EVM.
	 * This error is typically encountered when the jump destination in the bytecode is invalid or does not exist.
	 *
	 * Invalid JUMP errors can occur due to:
	 * - Incorrect jump destinations in the bytecode.
	 * - Bugs in the smart contract code causing jumps to non-existent locations.
	 * - Conditional logic errors leading to unexpected jump destinations.
	 *
	 * To debug an invalid JUMP error:
	 * 1. **Double Check Bytecode**: Ensure that the bytecode provided is valid.
	 * 2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the EVM version you are targeting.
	 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid JUMP occurs.
	 *
	 * @param {string} [message='Invalid JUMP error occurred.'] - Human-readable error message.
	 * @param {InvalidJumpErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag] - Optionally override the name/tag for the error.
	 * @param {string} [tag='InvalidJumpError'] - The tag for the error.}
	 */
	constructor(message = 'Invalid JUMP error occurred.', args = {}, tag = 'InvalidJumpError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidjumperror/',
			},
			tag,
		)
	}
}
