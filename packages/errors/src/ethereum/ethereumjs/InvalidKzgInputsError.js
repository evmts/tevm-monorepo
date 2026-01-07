import { EVMError } from '../EVMError.js'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidKzgInputsError}.
 * @typedef {Object} InvalidKzgInputsErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('../EVMError.js').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InvalidKzgInputsError'} _tag - Same as name, used internally.
 * @property {'InvalidKzgInputsError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidKzgInputsError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_INPUTS
	/**
	 * Constructs an InvalidKzgInputsError.
	 * Represents an EIP-4844 specific error that occurs when KZG inputs are invalid.
	 *
	 * Invalid inputs errors can occur due to:
	 * - Providing invalid KZG inputs that do not meet the expected criteria.
	 *
	 *
	 * @param {string} [message='Invalid inputs error occurred.'] - Human-readable error message.
	 * @param {InvalidKzgInputsErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidKzgInputsError'] - The tag for the error.}
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
