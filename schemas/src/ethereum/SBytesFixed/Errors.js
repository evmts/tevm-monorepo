/**
 * @module @evmts/schemas/ethereum/FixedBytes/Errors.js
 * @description Errors for FixedBytes parsing
 * @author William Cory <willcory10@gmail.com>
 * @todo add docs to how to encode into bytes from other data types
 */

import { formatErrors } from '@effect/schema/TreeFormatter'

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32} BytesCapacity
 */

// TODO more granular errors
/**
 * Error thrown when a FixedByte is invalid.
 * A FixedByte string is invalid if it's not within the bounds of its size.
 */
export class InvalidBytesFixedError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {string} options.bytes - The invalid bytes string.
	 * @param {BytesCapacity} options.size - The size of the bytes.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		bytes,
		size,
		message,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		if (!message) {
			const expectedLength = 2 + size * 2 // "0x" prefix + two characters for each byte
			message = `Received ${bytes} is not of correct length for Bytes${size}. Expected length: ${expectedLength}.`
		}
		super(`${InvalidBytesFixedError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
