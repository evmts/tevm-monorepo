import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidInputLengthError}.
 * @typedef {Object} InvalidInputLengthErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents a calldata/creation error that occurs when an invalid input length is encountered during EVM execution.
 *
 * Invalid input length errors can occur due to:
 * - Providing input data of incorrect length.
 *
 * To debug an invalid input length error:
 * 1. **Review Input Data**: Ensure that the input data provided matches the expected length.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid input length is encountered.
 *
 * @example
 * ```typescript
 * import { InvalidInputLengthError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidInputLengthError
 * } catch (error) {
 *   if (error instanceof InvalidInputLengthError) {
 *     console.error(error.message);
 *     // Handle the invalid input length error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid input length error occurred.'] - A human-readable error message.
 * @param {InvalidInputLengthErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class InvalidInputLengthError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_INPUT_LENGTH
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidInputLengthErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Invalid input length error occurred.', args = {}, tag = 'InvalidInputLengthError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidinputlengtherror/',
			},
			tag,
		)
	}
}
