import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381InputEmptyError}.
 * @typedef {Object} BLS12381InputEmptyErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an EIP-2537 specific error that occurs when an input is empty during BLS12-381 operations.
 *
 * Input empty errors can occur due to:
 * - Providing empty input data for BLS12-381 operations.
 *
 * @example
 * ```typescript
 * import { BLS12381InputEmptyError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a BLS12381InputEmptyError
 * } catch (error) {
 *   if (error instanceof BLS12381InputEmptyError) {
 *     console.error(error.message);
 *     // Handle the input empty error
 *   }
 * }
 * ```
 *
 * @param {string} [message='BLS12-381 input empty error occurred.'] - A human-readable error message.
 * @param {BLS12381InputEmptyErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'BLS12381InputEmptyError'} _tag - Same as name, used internally.
 * @property {'BLS12381InputEmptyError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BLS12381InputEmptyError extends ExecutionError {
	/** @type {string} */	static EVMErrorMessage = EVMError.errorMessages.BLS_12_381_INPUT_EMPTY
	/**
	 * Constructs a BLS12381InputEmptyError.
	 * Represents an EIP-2537 specific error that occurs when an input is empty during BLS12-381 operations.
	 *
	 * Input empty errors can occur due to:
	 * - Providing empty input data for BLS12-381 operations.
	 *
	 *
	 * @param {string} [message='BLS12-381 input empty error occurred.'] - Human-readable error message.
	 * @param {BLS12381InputEmptyErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BLS12381InputEmptyError'] - The tag for the error.
	 */
	constructor(message = 'BLS12-381 input empty error occurred.', args = {}, tag = 'BLS12381InputEmptyError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/bls12381inputemptyerror/',
			},
			tag,
		)
	}
}
