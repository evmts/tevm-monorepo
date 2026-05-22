import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidProofError}.
 * @typedef {Object} InvalidProofErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an EIP-4844 specific error that occurs when a KZG proof is invalid.
 *
 * Invalid proof errors can occur due to:
 * - Providing a KZG proof that does not meet the expected criteria.
 *
 * @example
 * ```typescript
 * import { InvalidProofError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidProofError
 * } catch (error) {
 *   if (error instanceof InvalidProofError) {
 *     console.error(error.message);
 *     // Handle the invalid proof error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid proof error occurred.'] - A human-readable error message.
 * @param {InvalidProofErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidProofError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_PROOF
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidProofErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid proof error occurred.', args = {}, tag = 'InvalidProofError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidprooferror/',
			},
			tag,
		)
	}
}
