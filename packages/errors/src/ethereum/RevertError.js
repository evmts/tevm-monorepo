import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a RevertError.
 * @typedef {Object} RevertErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('./EVMError.js').EVMError|BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {import('viem').Hex} [raw] - The raw data of the revert.
 */

/**
 * Represents an error that occurs when a transaction or message call is reverted.
 *
 * This error is typically encountered when a contract explicitly calls the `revert`
 * operation or when a condition in a `require` statement is not met. It's a way for
 * smart contracts to signal that an operation should be rolled back due to a failure
 * condition.
 *
 * The error code -32000 is a standard Ethereum JSON-RPC error code indicating a
 * generic server error, which is often used for revert errors.
 *
 * @example
 * try {
 *   const result = await client.call({
 *     to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
 *     data: '0x...' // encoded function call that might revert
 *   })
 * } catch (error) {
 *   if (error instanceof RevertError) {
 *     console.error('Transaction reverted:', error.message);
 *     console.log('Revert reason:', error.data); // If available
 *   }
 * }
 *
 * @param {string} message - A human-readable error message.
 * @param {RevertErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32000), standard Ethereum JSON-RPC error code for server errors.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 * @property {import('viem').Hex} [raw] - The raw data of the revert.
 */
export class RevertError extends BaseError {
	/**
	 * The error code for RevertError.
	 * @type {number}
	 */
	static code = 3

	/**
	 * Constructs a RevertError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {RevertErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='Revert'] - The tag for the error.
	 */
	constructor(message, args = {}, tag = 'Revert') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/reverterror/',
			},
			tag,
			RevertError.code,
		)

		if (args.raw) {
			this.raw = args.raw
		}
	}
}
