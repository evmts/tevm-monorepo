import { EVMError } from '@evmts/zevm/evm-error'
import { GasLimitExceededError } from '../GasLimitExceededError.js'

/**
 * Parameters for constructing a {@link CodeStoreOutOfGasError}.
 * @typedef {Object} CodeStoreOutOfGasErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {GasLimitExceededError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when a transaction runs out of gas during code storage.
 * This error is typically encountered when the gas provided for storing code is insufficient to complete its execution.
 * EVM transaction execution metadata level error
 *
 * Code store out of gas errors can occur due to:
 * - Insufficient gas provided for storing large contracts.
 * - Incorrect estimation of gas required for storing code.
 * - Contracts with high gas consumption during the deployment phase.
 * - Non-deterministic gas usage during code storage.
 * - If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.
 *
 * To debug a code store out of gas error:
 * 1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient, especially for large contracts. If you provided explicit gas-related parameters, double-check their values.
 * 2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption during deployment. Consider simplifying complex initialization code.
 * 3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and inspect gas usage.
 * 4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
 * 5. **Use Other Tools**: Use other tools such as [Foundry](https://book.getfoundry.sh/forge/gas). If it works in Foundry, consider [opening a Tevm bug report](https://github.com/evmts/tevm-monorepo/issues).
 *
 * @example
 * ```typescript
 * import { CodeStoreOutOfGasError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a CodeStoreOutOfGasError
 * } catch (error) {
 *   if (error instanceof CodeStoreOutOfGasError) {
 *     console.error(error.message);
 *     // Handle the code store out of gas error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Code store out of gas error occurred.'] - A human-readable error message.
 * @param {CodeStoreOutOfGasErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class CodeStoreOutOfGasError extends GasLimitExceededError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.CODESTORE_OUT_OF_GAS
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {CodeStoreOutOfGasErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Code store out of gas error occurred.', args = {}, tag = 'CodeStoreOutOfGasError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/codestoreoutofgaserror/',
			},
			tag,
		)
	}
}
