import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidStorageRootError.
 * @typedef {Object} InvalidStorageRootErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
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
