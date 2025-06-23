// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an ExecutionError.
 * @typedef {Object} ExecutionErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when an execution error happens on the Ethereum node.
 *
 * This error is typically encountered when there is a general execution error that does not fit more specific categories.
 * The error code -32015 is a non-standard extension used for EVM execution errors.
 *
 * @example
 * try {
 *   // Some operation that can throw an ExecutionError
 * } catch (error) {
 *   if (error instanceof ExecutionError) {
 *     console.error(error.message);
 *     // Handle the execution error
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {ExecutionErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - More discriminated version of name. Can be used to discriminate between errors with the same name.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32015), a convention for EVM execution errors.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class ExecutionError extends BaseError {
	/**
	 * The error code for ExecutionError.
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Constructs an ExecutionError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ExecutionErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='ExecutionError'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'ExecutionError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/executionerror/',
			},
			tag,
			ExecutionError.code,
		)
	}
}
