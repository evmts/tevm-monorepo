import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381InvalidInputLengthError}.
 * @typedef {Object} BLS12381InvalidInputLengthErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'BLS12381InvalidInputLengthError'} _tag - Same as name, used internally.
 * @property {'BLS12381InvalidInputLengthError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BLS12381InvalidInputLengthError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.BLS_12_381_INVALID_INPUT_LENGTH
	/**
	 * Constructs a BLS12381InvalidInputLengthError.
	 * Represents an EIP-2537 specific error that occurs when an invalid input length is encountered during BLS12-381 operations.
	 *
	 * Invalid input length errors can occur due to:
	 * - Providing input data of incorrect length for BLS12-381 operations.
	 *
	 *
	 * @param {string} [message='BLS12-381 invalid input length error occurred.'] - Human-readable error message.
	 * @param {BLS12381InvalidInputLengthErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BLS12381InvalidInputLengthError'] - The tag for the error.
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
