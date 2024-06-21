// Ideally we get this from viem
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
 * Represents an error that occurs when the execution of a contract fails.
 *
 * This error is typically encountered when a smart contract fails to execute properly.
 *
 * @example
 * try {
 *   // Some operation that can throw a ContractExecutionFailedError
 * } catch (error) {
 *   if (error instanceof ContractExecutionFailedError) {
 *     console.error(error.message);
 *     // Handle the contract execution failed error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ContractExecutionFailedErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'ContractExecutionFailed'} _tag - Same as name, used internally.
 * @property {'ContractExecutionFailed'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ContractExecutionFailedError extends BaseError {
	/**
	 * Constructs a ContractExecutionFailedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ContractExecutionFailedErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ContractExecutionFailed'] - The tag for the error.}
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
			-32004,
		)
	}
}
