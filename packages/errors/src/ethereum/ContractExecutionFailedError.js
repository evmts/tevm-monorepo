import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a ContractExecutionFailedError.
 * @typedef {Object} ContractExecutionFailedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the execution of a smart contract fails.
 *
 * This error is typically encountered when a smart contract's execution reverts or
 * encounters an exception during its operation. It can be due to various reasons such as
 * failing assertions, out-of-gas errors, or other contract-specific logic failures.
 *
 * The error code -32015 is a non-standard extension used by some Ethereum clients to
 * indicate a contract execution failure.
 *
 * @example
 * try {
 *   const result = await client.call({
 *     to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
 *     data: '0x...' // encoded function call
 *   })
 * } catch (error) {
 *   if (error instanceof ContractExecutionFailedError) {
 *     console.error('Contract execution failed:', error.message);
 *     console.log('Check the contract logic or input parameters');
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ContractExecutionFailedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32015), a convention for EVM execution errors.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ContractExecutionFailedError extends BaseError {
	/**
	 * The error code for ContractExecutionFailedError.
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Constructs a ContractExecutionFailedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ContractExecutionFailedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ContractExecutionFailed'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ContractExecutionFailed') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/contractexecutionfailederror/',
			},
			tag,
			ContractExecutionFailedError.code,
		)
	}
}
