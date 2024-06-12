import { EVMErrorMessage } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidProofError}.
 * @typedef {Object} InvalidProofErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when a KZG proof is invalid.
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
 * @property {'InvalidProofError'} _tag - Same as name, used internally.
 * @property {'InvalidProofError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidProofError extends ExecutionError {
	static EVMErrorMessage = EVMErrorMessage.INVALID_PROOF
	/**
	 * Constructs an InvalidProofError.
	 *
	 * @param {string} [message='Invalid proof error occurred.'] - Human-readable error message.
	 * @param {InvalidProofErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'Invalid proof error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidprooferror/',
		})

		/**
		 * @type {string}
		 * @override
		 */
		this.message = message

		/**
		 * @type {object|undefined}
		 */
		this.meta = args.meta
		/**
		 * @type {'InvalidProofError'}
		 */
		this._tag = 'InvalidProofError'
	}
}
