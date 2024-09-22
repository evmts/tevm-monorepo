import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidStorageRootError.
 * @typedef {Object} InvalidStorageRootErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the storage root parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a storage root parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * ```javascript
 * import { InvalidStorageRootError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x...',
 *     storageRoot: 'invalid', // This should be a valid storage root
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidStorageRootError) {
 *     console.error('Invalid storage root:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidStorageRootError extends InvalidParamsError {
	/**
	 * Constructs an InvalidStorageRootError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidStorageRootErrorParameters} [args={}] - Additional parameters for the InvalidStorageRootError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidstoragerooterror/',
			},
			'InvalidStorageRootError',
		)

		this.name = 'InvalidStorageRootError'
		this._tag = 'InvalidStorageRootError'
	}
}
