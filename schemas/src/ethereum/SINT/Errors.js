/**
 * @module @evmts/schemas/ethereum/SINT/Errors.js
 * @description Errors for SINT parsing
 * @author William Cory <willcory10@gmail.com>
 */

import { formatErrors } from '@effect/schema/TreeFormatter'

/**
 * @typedef {'int8' | 'int16' | 'int32' | 'int64' | 'int128' | 'int256'} INTName
 * @typedef {8 | 16 | 32 | 64 | 128 | 256} INTSize
 */

// TODO more granular errors
/**
 * Error thrown when an INT is invalid.
 * An int bigint is invalid if it's not within the bounds of its size.
 */
export class InvalidINTError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {bigint} options.int - The invalid int bigint.
	 * @param {INTSize} options.size - The size of the int.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		int,
		size,
		message,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		if (!message) {
			const min = BigInt(1) << BigInt(size - 1)
			if (int < -min) {
				message = `Received ${int} is too small to be an INT${size}. Must be >= -2^${
					size - 1
				}.`
			} else {
				message = `Received ${int} is too large to be an INT${size}. Must be < 2^${
					size - 1
				}.`
			}
		}
		super(`${InvalidINTError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
