import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidBeginSubError}.
 * @typedef {Object} InvalidBeginSubErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid BEGINSUB operation is executed within the EVM.
 *
 * Invalid BEGINSUB errors can occur due to:
 * - Incorrect use of the BEGINSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine execution.
 *
 * To debug an invalid BEGINSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the BEGINSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid BEGINSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidBeginSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidBeginSubError
 * } catch (error) {
 *   if (error instanceof InvalidBeginSubError) {
 *     console.error(error.message);
 *     // Handle the invalid BEGINSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid BEGINSUB error occurred.'] - A human-readable error message.
 * @param {InvalidBeginSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidBeginSubError extends ExecutionError {
	// Note: INVALID_BEGINSUB was removed from newer EVM runtimes.
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.INVALID_BEGINSUB
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidBeginSubErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid BEGINSUB error occurred.', args = {}, tag = 'InvalidBeginSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbeginsuberror/',
			},
			tag,
		)
	}
}
