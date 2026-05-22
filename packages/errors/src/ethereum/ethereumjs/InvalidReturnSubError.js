import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidReturnSubError}.
 * @typedef {Object} InvalidReturnSubErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an invalid bytecode/contract error that occurs when an invalid RETURNSUB operation is executed within the EVM.
 *
 * Invalid RETURNSUB errors can occur due to:
 * - Incorrect use of the RETURNSUB opcode.
 * - Bugs in the smart contract code causing invalid subroutine returns.
 *
 * To debug an invalid RETURNSUB error:
 * 1. **Review Subroutine Logic**: Ensure that the RETURNSUB opcode is used correctly within subroutine definitions.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid RETURNSUB occurs.
 *
 * @example
 * ```typescript
 * import { InvalidReturnSubError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidReturnSubError
 * } catch (error) {
 *   if (error instanceof InvalidReturnSubError) {
 *     console.error(error.message);
 *     // Handle the invalid RETURNSUB error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid RETURNSUB error occurred.'] - A human-readable error message.
 * @param {InvalidReturnSubErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidReturnSubError extends ExecutionError {
	// Note: INVALID_RETURNSUB was removed from newer EVM runtimes.
	/** @type {string} */ // static EVMErrorMessage = EVMError.errorMessages.INVALID_RETURNSUB
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidReturnSubErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid RETURNSUB error occurred.', args = {}, tag = 'InvalidReturnSubError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidreturnsuberror/',
			},
			tag,
		)
	}
}
