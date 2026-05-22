import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidCommitmentError}.
 * @typedef {Object} InvalidCommitmentErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidCommitmentError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_COMMITMENT
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidCommitmentErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
