// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing an ExecutionError.
 * @typedef {Object} ExecutionErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
