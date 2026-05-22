import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381InvalidInputLengthError}.
 * @typedef {Object} BLS12381InvalidInputLengthErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an EIP-2537 specific error that occurs when an invalid input length is encountered during BLS12-381 operations.
 *
 * Invalid input length errors can occur due to:
 * - Providing input data of incorrect length for BLS12-381 operations.
 *
 * @example
 * ```typescript
 * import { BLS12381InvalidInputLengthError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a BLS12381InvalidInputLengthError
 * } catch (error) {
 *   if (error instanceof BLS12381InvalidInputLengthError) {
 *     console.error(error.message);
 *     // Handle the invalid input length error
 *   }
 * }
 * ```
 *
 * @param {string} [message='BLS12-381 invalid input length error occurred.'] - A human-readable error message.
 * @param {BLS12381InvalidInputLengthErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class BLS12381InvalidInputLengthError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.BLS_12_381_INVALID_INPUT_LENGTH
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {BLS12381InvalidInputLengthErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(
		message = 'BLS12-381 invalid input length error occurred.',
		args = {},
		tag = 'BLS12381InvalidInputLengthError',
	) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/bls12381invalidinputlengtherror/',
			},
			tag,
		)
	}
}
