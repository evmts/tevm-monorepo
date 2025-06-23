import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a BlobGasLimitExceededError.
 * @typedef {Object} BlobGasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an error that occurs when the blob gas limit for a transaction is exceeded.
 *
 * This error is typically encountered when a transaction, particularly an EIP-4844 transaction,
 * uses more blob gas than allowed.
 *
 * @param {string} message - A human-readable error message.
 * @param {BlobGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {string} _tag - Same as name, used internally.
 * @property {string} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code (-32003), indicating a transaction rejection.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class BlobGasLimitExceededError extends BaseError {
	/**
	 * The error code for BlobGasLimitExceededError.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Constructs a BlobGasLimitExceededError.
	 *
	 * @param {string} [message='Blob gas limit exceeded'] - Human-readable error message.
	 * @param {BlobGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='BlobGasLimitExceededError'] - The tag for the error.
	 */
	constructor(message = 'Blob gas limit exceeded', args = {}, tag = 'BlobGasLimitExceededError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: 'https://tevm.sh',
				docsPath: '/reference/tevm/errors/classes/blobgaslimitexceedederror/',
			},
			tag,
			BlobGasLimitExceededError.code,
		)
	}
}
