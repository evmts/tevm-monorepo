import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidJumpError}.
 * @typedef {Object} InvalidJumpErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidJumpError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_JUMP
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidJumpErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
