import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidEofFormatError}.
 * @typedef {Object} InvalidEofFormatErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when an invalid EOF format is encountered during EVM execution.
 *
 * This error is specific to EOF
 *
 * Invalid EOF format errors can occur due to:
 * - Bugs in the smart contract code causing invalid EOF format.
 * - Issues during the deployment process resulting in invalid EOF format.
 *
 * To debug an invalid EOF format error:
 * 1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.
 *
 * @example
 * ```typescript
 * import { InvalidEofFormatError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidEofFormatError
 * } catch (error) {
 *   if (error instanceof InvalidEofFormatError) {
 *     console.error(error.message);
 *     // Handle the invalid EOF format error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid EOF format error occurred.'] - A human-readable error message.
 * @param {InvalidEofFormatErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidEofFormatError'} _tag - Same as name, used internally.
 * @property {'InvalidEofFormatError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidEofFormatError extends ExecutionError {
	/** @type {string} */	static EVMErrorMessage = EVMError.errorMessages.INVALID_EOF_FORMAT
	/**
	 * Constructs an InvalidEofFormatError.
	 * Represents an error that occurs when an invalid EOF format is encountered during EVM execution.
	 *
	 * This error is specific to EOF
	 *
	 * Invalid EOF format errors can occur due to:
	 * - Bugs in the smart contract code causing invalid EOF format.
	 * - Issues during the deployment process resulting in invalid EOF format.
	 *
	 * To debug an invalid EOF format error:
	 * 1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.
	 *
	 * @param {string} [message='Invalid EOF format error occurred.'] - Human-readable error message.
	 * @param {InvalidEofFormatErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidEofFormatError'] - The tag for the error.
	 */
	constructor(message = 'Invalid EOF format error occurred.', args = {}, tag = 'InvalidEofFormatError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalideofformatterror/',
			},
			tag,
		)
	}
}
