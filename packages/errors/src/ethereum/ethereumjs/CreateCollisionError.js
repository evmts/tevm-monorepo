import { EVMError } from '@evmts/zevm/evm-error'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link CreateCollisionError}.
 * @typedef {Object} CreateCollisionErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {ExecutionError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an execution error that occurs when a contract creation results in a collision.
 *
 * Create collision errors can occur due to:
 * - Attempting to deploy a contract to an address that is already in use.
 *
 * To debug a create collision error:
 * 1. **Review Deployment Logic**: Ensure that the contract address is not already in use.
 * 2. **Nonces** Check that the nonce of the account used had been incremented. Remember nonces do not update until a block is mined.
 * 2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and identify the collision.
 *
 * @example
 * ```typescript
 * import { CreateCollisionError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a CreateCollisionError
 * } catch (error) {
 *   if (error instanceof CreateCollisionError) {
 *     console.error(error.message);
 *     // Handle the create collision error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Create collision error occurred.'] - A human-readable error message.
 * @param {CreateCollisionErrorParameters} [args={}] - Additional parameters for the BaseError.
 */
export class CreateCollisionError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.CREATE_COLLISION
	/**
	 * @param {string} [message] - Human-readable error message.
	 * @param {CreateCollisionErrorParameters} [args] - Additional parameters.
	 * @param {string} [tag] - Internal error tag.
	 */
	constructor(message = 'Create collision error occurred.', args = {}, tag = 'CreateCollisionError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/createcollisionerror/',
			},
			tag,
		)
	}
}
