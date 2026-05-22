import { EVMError } from '@evmts/zevm/evm-error'
import { RevertError } from '../RevertError.js'

/**
 * Parameters for constructing a {@link EvmRevertError}.
 * @typedef {Object} EvmRevertErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('@evmts/zevm/evm-error').EVMError} [cause] - The cause of the error. From running Tevm EVM.runCall
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an execution error that occurs when a transaction is reverted during EVM execution.
 * This error is typically encountered when a smart contract execution is reverted due to unmet conditions or failed assertions.
 *
 * EvmRevert errors can occur due to:
 * - Failed assertions in the smart contract code.
 * - Conditions in the code that trigger a revert.
 * - Insufficient gas to complete the transaction.
 * - Contract logic that intentionally reverts under certain conditions.
 *
 * To debug a revert error:
 * 1. **Review Revert Conditions**: Ensure that the conditions in the contract code that trigger reverts are properly handled and expected.
 * 2. **Check Assertions**: Verify that all assertions in the code are valid and necessary.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the revert occurs.
 * 4. **Inspect Contract Logic**: Manually inspect the contract code to understand why the revert is being triggered and ensure it is intentional.
 *
 * @example
 * ```typescript
 * import { EvmRevertError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a EvmRevertError
 * } catch (error) {
 *   if (error instanceof EvmRevertError) {
 *     console.error(error.message);
 *     // Handle the revert error
 *   }
 * }
 * ```
 *
 * @param {string} [message='EvmRevert error occurred.'] - A human-readable error message.
 * @param {EvmRevertErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class EvmRevertError extends RevertError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.REVERT
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {EvmRevertErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Revert error occurred.', args = {}, tag = 'EvmRevertError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/reverterror/',
			},
			tag,
		)
	}
}
