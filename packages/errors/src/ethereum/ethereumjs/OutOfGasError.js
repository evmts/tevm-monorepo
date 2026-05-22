import { EVMError } from '@evmts/zevm/evm-error'
import { GasLimitExceededError } from '../GasLimitExceededError.js'

/**
 * Parameters for constructing an OutOfGasError.
 * @typedef {Object} OutOfGasErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {GasLimitExceededError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an execution error that occurs when a transaction runs out of gas during execution.
 * This error is typically encountered when the gas provided for a transaction is insufficient to complete its execution.
 *
 * Out of gas errors can occur due to:
 * - Insufficient gas provided for complex transactions or loops.
 * - Incorrect estimation of gas required for certain operations.
 * - Contracts with high gas consumption in specific functions.
 * - Non-deterministic gas usage in contracts.
 * - If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.
 *
 * To debug an out of gas error:
 * 1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient. If you provided explicit gas-related parameters, double-check their values.
 * 2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption, especially in loops and complex operations. Remove potential non-deterministic behaviors.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect gas usage.
 * 4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
 * 5. **Use Other Tools**: Use other tools with gas profiling such as [Foundry](https://book.getfoundry.sh/forge/gas).
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation that can throw an OutOfGasError
 * } catch (error) {
 *   if (error instanceof OutOfGasError) {
 *     console.error(error.message);
 *     // Handle the out of gas error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Out of gas error occurred.'] - A human-readable error message.
 * @param {OutOfGasErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class OutOfGasError extends GasLimitExceededError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.OUT_OF_GAS
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {OutOfGasErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Out of gas error occurred.', args = {}, tag = 'OutOfGasError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/outofgaserror/',
			},
			tag,
		)
	}
}
