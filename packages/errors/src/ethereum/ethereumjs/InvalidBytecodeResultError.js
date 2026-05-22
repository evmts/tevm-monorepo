import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link InvalidBytecodeResultError}.
 * @typedef {Object} InvalidBytecodeResultErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
 */
export class InvalidBytecodeResultError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.INVALID_BYTECODE_RESULT
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidBytecodeResultErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
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
