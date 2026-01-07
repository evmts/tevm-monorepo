import { EVMError } from '../EVMError.js'
import { GasLimitExceededError } from '../GasLimitExceededError.js'

/**
 * Parameters for constructing a {@link CodeStoreOutOfGasError}.
 * @typedef {Object} CodeStoreOutOfGasErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {GasLimitExceededError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * 5. **Use Other Tools**: Use other tools such as [Foundry](https://book.getfoundry.sh/forge/gas). If it works in Foundry, consider [opening a bug report](https://github.com/ethereumjs/ethereumjs-monorepo/issues).
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
 * @property {'CodeStoreOutOfGasError'} _tag - Same as name, used internally.
 * @property {'CodeStoreOutOfGasError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class CodeStoreOutOfGasError extends GasLimitExceededError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.CODESTORE_OUT_OF_GAS
	/**
	 * Constructs a CodeStoreOutOfGasError.
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
	 * @param {string} [message='Code store out of gas error occurred.'] - Human-readable error message.
	 * @param {CodeStoreOutOfGasErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='CodeStoreOutOfGasError'] - The tag for the error.
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
