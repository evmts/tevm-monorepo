import { EVMError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InitcodeSizeViolationError}.
 * @typedef {Object} InitcodeSizeViolationErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.
 *
 * Initcode size violation errors can occur due to:
 * - Bugs in the smart contract code causing the initcode to exceed the maximum size.
 * - Issues during the deployment process resulting in oversized initcode.
 *
 * To debug an initcode size violation error:
 * 1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.
 *
 * @example
 * ```typescript
 * import { InitcodeSizeViolationError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InitcodeSizeViolationError
 * } catch (error) {
 *   if (error instanceof InitcodeSizeViolationError) {
 *     console.error(error.message);
 *     // Handle the initcode size violation error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Initcode size violation error occurred.'] - A human-readable error message.
 * @param {InitcodeSizeViolationErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InitcodeSizeViolationError'} _tag - Same as name, used internally.
 * @property {'InitcodeSizeViolationError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InitcodeSizeViolationError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INITCODE_SIZE_VIOLATION
	/**
	 * Constructs an InitcodeSizeViolationError.
	 * Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.
	 *
	 * Initcode size violation errors can occur due to:
	 * - Bugs in the smart contract code causing the initcode to exceed the maximum size.
	 * - Issues during the deployment process resulting in oversized initcode.
	 *
	 * To debug an initcode size violation error:
	 * 1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
	 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.
	 *
	 * @param {string} [message='Initcode size violation error occurred.'] - Human-readable error message.
	 * @param {InitcodeSizeViolationErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InitcodeSizeViolationError'] - The tag for the error.
	 */
	constructor(message = 'Initcode size violation error occurred.', args = {}, tag = 'InitcodeSizeViolationError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/initcodesizeviolationerror/',
			},
			tag,
		)
	}
}
