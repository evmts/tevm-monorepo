import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381InputEmptyError}.
 * @typedef {Object} BLS12381InputEmptyErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class BLS12381InputEmptyError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.BLS_12_381_INPUT_EMPTY
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {BLS12381InputEmptyErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
