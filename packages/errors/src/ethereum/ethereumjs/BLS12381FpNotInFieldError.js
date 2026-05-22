import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381FpNotInFieldError}.
 * @typedef {Object} BLS12381FpNotInFieldErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class BLS12381FpNotInFieldError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {BLS12381FpNotInFieldErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
