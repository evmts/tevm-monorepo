import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381FpNotInFieldError}.
 * @typedef {Object} BLS12381FpNotInFieldErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an EIP-2537 specific error that occurs when an fp point is not in the field during BLS12-381 operations.
 *
 * Fp point not in field errors can occur due to:
 * - Providing an fp point that does not lie within the expected field for BLS12-381 operations.
 *
 * @example
 * ```typescript
 * import { BLS12381FpNotInFieldError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a BLS12381FpNotInFieldError
 * } catch (error) {
 *   if (error instanceof BLS12381FpNotInFieldError) {
 *     console.error(error.message);
 *     // Handle the fp point not in field error
 *   }
 * }
 * ```
 *
 * @param {string} [message='BLS12-381 fp point not in field error occurred.'] - A human-readable error message.
 * @param {BLS12381FpNotInFieldErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'BLS12381FpNotInFieldError'} _tag - Same as name, used internally.
 * @property {'BLS12381FpNotInFieldError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BLS12381FpNotInFieldError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD
	/**
	 * Constructs a BLS12381FpNotInFieldError.
	 * Represents an EIP-2537 specific error that occurs when an fp point is not in the field during BLS12-381 operations.
	 *
	 * Fp point not in field errors can occur due to:
	 * - Providing an fp point that does not lie within the expected field for BLS12-381 operations.
	 *
	 *
	 * @param {string} [message='BLS12-381 fp point not in field error occurred.'] - Human-readable error message.
	 * @param {BLS12381FpNotInFieldErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BLS12381FpNotInFieldError'] - The tag for the error.
	 */
	constructor(
		message = 'BLS12-381 fp point not in field error occurred.',
		args = {},
		tag = 'BLS12381FpNotInFieldError',
	) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/bls12381fpnotinfielderror/',
			},
			tag,
		)

		/**
		 * @type {string}
		 * @override
		 */
		this.message = message

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
	}
}
