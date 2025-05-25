import { EvmError } from '@ethereumjs/evm'
import { ExecutionError } from '../ExecutionErrorError.js'

/**
 * Parameters for constructing a {@link CreateCollisionError}.
 * @typedef {Object} CreateCollisionErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {ExecutionError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
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
 * @property {'CreateCollisionError'} _tag - Same as name, used internally.
 * @property {'CreateCollisionError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class CreateCollisionError extends ExecutionError {
	/** @type {string} */ static EVMErrorMessage = EvmError.errorMessages.CREATE_COLLISION
	/**
	 * Constructs a CreateCollisionError.
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
	 * @param {string} [message='Create collision error occurred.'] - Human-readable error message.
	 * @param {CreateCollisionErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='CreateCollisionError'] - The tag for the error.
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
