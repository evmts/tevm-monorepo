/**
 * @module BlockNumber Schema
 * Types and validators for SBlockNumber.
 * Represents the sequential order of a block in the Ethereum blockchain.
 */

import { int, nonNegative, number, parseEither } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isRight } from 'effect/Either'

/**
 * Type representing a valid BlockNumber.
 * A valid BlockNumber is a `number` >= 0
 * @typedef {number} BlockNumber
 * @example
 * ```typescript
 * import { BlockNumber } from '@evmts/schemas';
 * const blockNumber = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies BlockNumber;
 * ```
 */

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the BlockNumber type.
 * @type {import('@effect/schema/Schema').Schema<number, BlockNumber>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SBlockNumber: Schema<number, BlockNumber>;
 * ```
 */
export const SBlockNumber = number.pipe(nonNegative(), int())

/**
 * Type guard that returns true if the provided number is a valid Ethereum block number.
 * @param {unknown} blockNumber
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBlockNumber } from '@evmts/schemas';
 * isBlockNumber('0x1234567890abcdef1234567890abcdef12345678');  // true
 * isBlockNumber('not a blockNumber'); // false
 * ````
 */
export const isBlockNumber = (blockNumber) => {
	return isRight(parseEither(SBlockNumber)(blockNumber))
}

/**
 * Error thrown when a BlockNumber is invalid.
 * A block number is invalid if it is not a non-negative integer.
 */
export class InvalidBlockNumberError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {unknown} [options.blockNumber] - The invalid block number.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		blockNumber,
		message = `Value ${blockNumber} is not a valid BlockNumber. BlockNumbers must be an integer >= 0`,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	} = {}) {
		super(`${InvalidBlockNumberError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses a BlockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {BlockNumber} TBlockNumber
 * @param {TBlockNumber} blockNumber
 * @returns {Effect.Effect<never, InvalidBlockNumberError, TBlockNumber>}
 * @example
 * ```ts
 * import { parseBlockNumberSafe } from '@evmts/schemas';
 * const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseBlockNumberSafe = (blockNumber) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBlockNumberError, TBlockNumber>} */
		(
			parseEither(SBlockNumber)(blockNumber).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBlockNumberError({ blockNumber, cause }),
				),
			)
		)
	return out
}

/**
 * Parses a BlockNumber and returns the value if no errors.
 * @template {BlockNumber} TBlockNumber
 * @param {TBlockNumber} blockNumber
 * @returns {TBlockNumber}
 * @example
 * ```ts
 * import { parseBlockNumber } from '@evmts/schemas';
 * const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseBlockNumber = (blockNumber) => {
	return runSync(parseBlockNumberSafe(blockNumber))
}
