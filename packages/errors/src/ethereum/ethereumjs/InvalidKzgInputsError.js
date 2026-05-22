import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidKzgInputsError}.
 * @typedef {Object} InvalidKzgInputsErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an EIP-4844 specific error that occurs when KZG inputs are invalid.
 *
 * Invalid inputs errors can occur due to:
 * - Providing invalid KZG inputs that do not meet the expected criteria.
 *
 * @example
 * ```typescript
 * import { InvalidKzgInputsError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidKzgInputsError
 * } catch (error) {
 *   if (error instanceof InvalidKzgInputsError) {
 *     console.error(error.message);
 *     // Handle the invalid inputs error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid inputs error occurred.'] - A human-readable error message.
 * @param {InvalidKzgInputsErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidKzgInputsError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_INPUTS
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidKzgInputsErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid inputs error occurred.', args = {}, tag = 'InvalidKzgInputsError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidinputserror/',
			},
			tag,
		)
	}
}
