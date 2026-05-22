import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidBlobVersionedHashesError.
 * @typedef {Object} InvalidBlobVersionedHashesErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the blobVersionedHashes parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a blobVersionedHashes parameter that is malformed or does not conform to the expected structure.
 *
 * @example
 * ```javascript
 * import { InvalidBlobVersionedHashesError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.sendTransaction({
 *     // ... other transaction parameters
 *     blobVersionedHashes: ['invalid_hash'], // This should be a valid versioned hash
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidBlobVersionedHashesError) {
 *     console.error('Invalid blob versioned hashes:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidBlobVersionedHashesError extends InvalidParamsError {
	/**
	 * Constructs an InvalidBlobVersionedHashesError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidBlobVersionedHashesErrorParameters} [args={}] - Additional parameters for the InvalidBlobVersionedHashesError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidblobversionedhasheserror/',
			},
			'InvalidBlobVersionedHashesError',
		)

		this.name = 'InvalidBlobVersionedHashesError'
		this._tag = 'InvalidBlobVersionedHashesError'
	}
}
