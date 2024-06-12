import { EVMErrorMessage } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidInputLengthError}.
 * @typedef {Object} InvalidInputLengthErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'InvalidInputLengthError'} _tag - Same as name, used internally.
 * @property {'InvalidInputLengthError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidInputLengthError extends ExecutionError {
	static EVMErrorMessage = EVMErrorMessage.INVALID_INPUT_LENGTH
	/**
	 * Constructs an InvalidInputLengthError.
	 * Represents a calldata/creation error that occurs when an invalid input length is encountered during EVM execution.
	 *
	 * Invalid input length errors can occur due to:
	 * - Providing input data of incorrect length.
	 *
	 * To debug an invalid input length error:
	 * 1. **Review Input Data**: Ensure that the input data provided matches the expected length.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid input length is encountered.
	 *
	 * @param {string} [message='Invalid input length error occurred.'] - Human-readable error message.
	 * @param {InvalidInputLengthErrorParameters} [args={}] - Additional parameters for the BaseError.
	 */
	constructor(message = 'Invalid input length error occurred.', args = {}) {
		super(message, {
			...args,
			docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
			docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidinputlengtherror/',
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
		 * @type {'InvalidInputLengthError'}
		 */
		this._tag = 'InvalidInputLengthError'
	}
}
