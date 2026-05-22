import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing an {@link InvalidBytesSizeError}.
 * @typedef {Object} InvalidBytesSizeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {InternalError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the size of the bytes does not match the expected size.
 *
 * @example
 * ```javascript
 * import { InvalidBytesSizeError } from '@tevm/errors'
 * import { hexToBytes } from '@tevm/utils'
 *
 * function requireBytes32(value) {
 *   const bytes = hexToBytes(value)
 *   if (bytes.length !== 32) {
 *     throw new InvalidBytesSizeError(bytes.length, 32)
 *   }
 *   return bytes
 * }
 *
 * try {
 *   requireBytes32('0x1234') // This will throw an InvalidBytesSizeError
 * } catch (error) {
 *   if (error instanceof InvalidBytesSizeError) {
 *     console.error(`Invalid bytes size: ${error.message}`)
 *     console.log(`Actual size: ${error.size}, Expected size: ${error.expectedSize}`)
 *   }
 * }
 * ```
 *
 * @extends {InternalError}
 */
export class InvalidBytesSizeError extends InternalError {
	/**
	 * The actual size of the bytes.
	 * @type {number}
	 */
	size

	/**
	 * The expected size of the bytes.
	 * @type {number}
	 */
	expectedSize

	/**
	 * Constructs an InvalidBytesSizeError.
	 *
	 * @param {number} size - The actual size of the bytes.
	 * @param {number} expectedSize - The expected size of the bytes.
	 * @param {string} [message] - Human-readable error message.
	 * @param {InvalidBytesSizeErrorParameters} [args] - Additional parameters for the error.
	 */
	constructor(size, expectedSize, message, args = {}) {
		super(
			message || `Invalid bytes size. Expected ${expectedSize}, received ${size}`,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbytessizeerror/',
			},
			'InvalidBytesSizeError',
		)

		this.size = size
		this.expectedSize = expectedSize
		this.name = 'InvalidBytesSizeError'
		this._tag = 'InvalidBytesSizeError'
	}
}
