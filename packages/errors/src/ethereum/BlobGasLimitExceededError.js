import { BaseError } from './BaseError.js'

/**
 * Parameters for constructing a BlobGasLimitExceededError.
 * @typedef {Object} BlobGasLimitExceededErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the blob gas limit for a transaction is exceeded.
 *
 * This error is typically encountered when a transaction, particularly an EIP-4844 transaction,
 * uses more blob gas than allowed.
 *
 * @param {string} message - A human-readable error message.
 * @param {BlobGasLimitExceededErrorParameters} [args={}] - Additional parameters for the BaseError.
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
