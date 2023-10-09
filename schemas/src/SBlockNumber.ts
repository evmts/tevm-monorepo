import type { ParseErrors } from '@effect/schema/ParseResult'
import { int, nonNegative, number, parseEither } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { type Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isRight } from 'effect/Either'
import type { NonEmptyReadonlyArray } from 'effect/ReadonlyArray'

/**
 * Type representing a valid Ethereum block number
 */
export type BlockNumber = number

/**
 * Effect Schema for {@link BlockNumber} type
 * @example
 * ```typescript
 * const validBlockNumber = 5 as const
 * const invalidBlockNumber = -1 as const
 * ````
 */
export const SBlockNumber = number.pipe(nonNegative(), int())

/**
 * Returns a boolean indicating whether the provided number is a valid ethereum blocknumber
 */
export const isBlockNumber = (
	blockNumber: unknown,
): blockNumber is BlockNumber => {
	return isRight(parseEither(SBlockNumber)(blockNumber))
}

/**
 * Error thrown when a {@link BlockNumber} is invalid
 * A block number is invalid if it is not a non-negative integer
 */
export class InvalidBlockNumberError extends TypeError {
	override name = InvalidBlockNumberError.name
	_tag = InvalidBlockNumberError.name
	constructor({
		blockNumber,
		message = `Value ${blockNumber} is not a valid BlockNumber. BlockNumbers must be an integer >= 0`,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}: {
		blockNumber: number
		message?: string
		docs?: string
		cause?: NonEmptyReadonlyArray<ParseErrors>
	}) {
		super(
			`${InvalidBlockNumberError.name}: ${message}
${docs}`,
			{ cause: cause && formatErrors(cause) },
		)
	}
}

/**
 * Parses a {@link BlockNumber} safely into an effect
 * @example
 * ```typescript
 * // $ExpectType number
 * const blockNumber = parseBlockNumber(5)
 * parseBlockNumber(-1) // throws InvalidBlockNumberError
 * ````
 */
export const parseBlockNumberSafe = <TBlockNumber extends BlockNumber>(
	blockNumber: TBlockNumber,
): Effect.Effect<never, InvalidBlockNumberError, TBlockNumber> => {
	return parseEither(SBlockNumber)(blockNumber).pipe(
		mapError(
			({ errors: cause }) =>
				new InvalidBlockNumberError({ blockNumber, cause }),
		),
	) as Effect.Effect<never, InvalidBlockNumberError, TBlockNumber>
}

/*
 * Parses a {@link BlockNumber} returning the block number or throwing an {@link InvalidBlockNumberError} if invalid
 * @example
 * ```typescript
 * // $ExpectType number
 * const blockNumber = parseBlockNumber(5)
 * parseBlockNumber(-1) // throws InvalidBlockNumberError
 * ````
 */
export const parseBlockNumber = <TBlockNumber extends BlockNumber>(
	blockNumber: TBlockNumber,
): TBlockNumber => {
	return runSync(parseBlockNumberSafe(blockNumber))
}
