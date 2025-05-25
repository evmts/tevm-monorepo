import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link BLS12381PointNotOnCurveError}.
 * @typedef {Object} BLS12381PointNotOnCurveErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an EIP-2537 specific error that occurs when a point is not on the curve during BLS12-381 operations.
 *
 * Point not on curve errors can occur due to:
 * - Providing a point that does not lie on the expected curve for BLS12-381 operations.
 *
 * @example
 * ```typescript
 * import { BLS12381PointNotOnCurveError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a BLS12381PointNotOnCurveError
 * } catch (error) {
 *   if (error instanceof BLS12381PointNotOnCurveError) {
 *     console.error(error.message);
 *     // Handle the point not on curve error
 *   }
 * }
 * ```
 *
 * @param {string} [message='BLS12-381 point not on curve error occurred.'] - A human-readable error message.
 * @param {BLS12381PointNotOnCurveErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'BLS12381PointNotOnCurveError'} _tag - Same as name, used internally.
 * @property {'BLS12381PointNotOnCurveError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BLS12381PointNotOnCurveError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.BLS_12_381_POINT_NOT_ON_CURVE
	/**
	 * Constructs a BLS12381PointNotOnCurveError.
	 * Represents an EIP-2537 specific error that occurs when a point is not on the curve during BLS12-381 operations.
	 *
	 * Point not on curve errors can occur due to:
	 * - Providing a point that does not lie on the expected curve for BLS12-381 operations.
	 *
	 * @param {string} [message='BLS12-381 point not on curve error occurred.'] - Human-readable error message.
	 * @param {BLS12381PointNotOnCurveErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BLS12381PointNotOnCurveError'] - The tag for the error.
	 */
	constructor(
		message = 'BLS12-381 point not on curve error occurred.',
		args = {},
		tag = 'BLS12381PointNotOnCurveError',
	) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/bls12381pointnotoncurveerror/',
			},
			tag,
		)
	}
}
