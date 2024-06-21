import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing an {@link InvalidBytesSizeError}.
 * @typedef {Object} InvalidBytesSizeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the size of the bytes does not match the expected size.
 *
 * @example
 * ```typescript
 * import { InvalidBytesSizeError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw an InvalidBytesSizeError
 * } catch (error) {
 *   if (error instanceof InvalidBytesSizeError) {
 *     console.error(error.message);
 *     // Handle the invalid bytes size error
 *   }
 * }
 * ```
 *
 * @param {number} size - The actual size of the bytes.
 * @param {number} expectedSize - The expected size of the bytes.
 * @param {string} [message='Invalid bytes size error occurred.'] - A human-readable error message.
 * @param {InvalidBytesSizeErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'InvalidBytesSizeError'} _tag - Same as name, used internally.
 * @property {'InvalidBytesSizeError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {number} size - The actual size of the bytes.
 * @property {number} expectedSize - The expected size of the bytes.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class InvalidBytesSizeError extends /** we extend InternalError because the public api only accepts hex strings not bytes for most part*/ InternalError {
	/**
	 * Constructs an InvalidBytesSizeError.
	 *
	 * @param {number} size - The actual size of the bytes.
	 * @param {number} expectedSize - The expected size of the bytes.
	 * @param {string} [message='Invalid bytes size error occurred.'] - Human-readable error message.
	 * @param {InvalidBytesSizeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='InvalidBytesSizeError'] - The tag for the error.}
	 */
	constructor(
		size,
		expectedSize,
		message = `Invalid bytes size error occurred. Expected ${expectedSize} receipted ${size}`,
		args = {},
		tag = 'InvalidBytesSizeError',
	) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invalidbytessizeerror/',
			},
			tag,
		)
	}
}
