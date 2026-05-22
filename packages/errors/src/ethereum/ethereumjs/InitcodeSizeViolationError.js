import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InitcodeSizeViolationError}.
 * @typedef {Object} InitcodeSizeViolationErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InitcodeSizeViolationError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INITCODE_SIZE_VIOLATION
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InitcodeSizeViolationErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
