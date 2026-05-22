import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidJumpSubError}.
 * @typedef {Object} InvalidJumpSubErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.
 *
 * Invalid JUMPSUB errors can occur due to:
 * - Incorrect use of the JUMPSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine jumps.
 *
 * To debug an invalid JUMPSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidJumpSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidJumpSubError
 * } catch (error) {
 *   if (error instanceof InvalidJumpSubError) {
 *     console.error(error.message);
 *     // Handle the invalid JUMPSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid JUMPSUB error occurred.'] - A human-readable error message.
 * @param {InvalidJumpSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidJumpSubError extends ExecutionError {
	// Note: INVALID_JUMPSUB was removed from newer EVM runtimes.
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.INVALID_JUMPSUB
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidJumpSubErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid JUMPSUB error occurred.', args = {}, tag = 'InvalidJumpSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidjumpsuberror/',
			},
			tag,
		)
	}
}
