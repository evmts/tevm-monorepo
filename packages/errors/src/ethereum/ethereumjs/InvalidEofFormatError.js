import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidEofFormatError}.
 * @typedef {Object} InvalidEofFormatErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidEofFormatError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_EOF_FORMAT
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidEofFormatErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
