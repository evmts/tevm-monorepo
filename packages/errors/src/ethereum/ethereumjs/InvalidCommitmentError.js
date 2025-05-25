import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidCommitmentError}.
 * @typedef {Object} InvalidCommitmentErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an EIP-4844 specific error that occurs when a KZG commitment does not match the versioned hash.
 *
 * Invalid commitment errors can occur due to:
 * - Providing a KZG commitment that does not match the expected versioned hash.
 *
 * @example
 * ```typescript
 * import { InvalidCommitmentError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidCommitmentError
 * } catch (error) {
 *   if (error instanceof InvalidCommitmentError) {
 *     console.error(error.message);
 *     // Handle the invalid commitment error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid commitment error occurred.'] - A human-readable error message.
 * @param {InvalidCommitmentErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidCommitmentError'} _tag - Same as name, used internally.
 * @property {'InvalidCommitmentError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidCommitmentError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_COMMITMENT
	/**
	 * Constructs an InvalidCommitmentError.
	 * Represents an EIP-4844 specific error that occurs when a KZG commitment does not match the versioned hash.
	 *
	 * Invalid commitment errors can occur due to:
	 * - Providing a KZG commitment that does not match the expected versioned hash.
	 *
	 * @example
	 * ```typescript
	 * import { InvalidCommitmentError } from '@tevm/errors'
	 * try {
	 *   // Some operation that can throw an InvalidCommitmentError
	 * } catch (error) {
	 *   if (error instanceof InvalidCommitmentError) {
	 *     console.error(error.message);
	 *     // Handle the invalid commitment error
	 *   }
	 * }
	 * ```
	 *
	 * @param {string} [message='Invalid commitment error occurred.'] - Human-readable error message.
	 * @param {InvalidCommitmentErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidCommitmentError'] - The tag for the error.
	 */
	constructor(message = 'Invalid commitment error occurred.', args = {}, tag = 'InvalidCommitmentError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidcommitmenterror/',
			},
			tag,
		)
	}
}
