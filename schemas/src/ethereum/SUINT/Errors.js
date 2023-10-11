/**
 * @module @evmts/schemas/ethereum/SUINT/Errors.js
 * @description Errors for SUINT parsing
 * @author William Cory <willcory10@gmail.com>
 */

import { formatErrors } from '@effect/schema/TreeFormatter'

/**
 * @typedef {'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'} UINTName
 * @typedef {8 | 16 | 32 | 64 | 128 | 256} UINTSize
 */

// TODO more granular errors
/**
 * Error thrown when a UINT256 is invalid.
 * A uintbigint is invalid if it is not a non-negative integer or overflows
 */
export class InvalidUINTError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {bigint} options.uint - The invalid uint256 bigint.
	 * @param {UINTSize} options.size - The size of the uint.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		uint,
		size,
		message = uint < BigInt(0)
			? `Recieved ${uint} is too small to be a ${size}. Must be >= 0.`
			: `Value uint${size} is too big to be a UINT${size}`,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		super(`${InvalidUINTError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
