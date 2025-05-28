import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidBytecodeResultError}.
 * @typedef {Object} InvalidBytecodeResultErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents a calldata/creation error that occurs when invalid bytecode is deployed during EVM execution.
 *
 * Invalid bytecode result errors can occur due to:
 * - Bugs in the smart contract code causing invalid bytecode to be generated.
 * - Issues during the deployment process resulting in invalid bytecode.
 *
 * To debug an invalid bytecode result error:
 * 1. **Review Deployment Process**: Ensure that the bytecode being deployed is valid and correctly generated.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid bytecode is generated or deployed.
 *
 * @example
 * ```typescript
 * import { InvalidBytecodeResultError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidBytecodeResultError
 * } catch (error) {
 *   if (error instanceof InvalidBytecodeResultError) {
 *     console.error(error.message);
 *     // Handle the invalid bytecode result error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Invalid bytecode result error occurred.'] - A human-readable error message.
 * @param {InvalidBytecodeResultErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidBytecodeResultError'} _tag - Same as name, used internally.
 * @property {'InvalidBytecodeResultError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidBytecodeResultError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_BYTECODE_RESULT
	/**
	 * Constructs an InvalidBytecodeResultError.
	 * Represents a calldata/creation error that occurs when invalid bytecode is deployed during EVM execution.
	 *
	 * Invalid bytecode result errors can occur due to:
	 * - Bugs in the smart contract code causing invalid bytecode to be generated.
	 * - Issues during the deployment process resulting in invalid bytecode.
	 *
	 * To debug an invalid bytecode result error:
	 * 1. **Review Deployment Process**: Ensure that the bytecode being deployed is valid and correctly generated.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid bytecode is generated or deployed.
	 *
	 * @param {string} [message='Invalid bytecode result error occurred.'] - Human-readable error message.
	 * @param {InvalidBytecodeResultErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidBytecodeResultError'] - The tag for the error.
	 */
	constructor(message = 'Invalid bytecode result error occurred.', args = {}, tag = 'InvalidBytecodeResultError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbytecoderesulterror/',
			},
			tag,
		)
	}
}
