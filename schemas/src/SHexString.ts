import type { ParseErrors } from '@effect/schema/ParseResult'
import { filter, string } from '@effect/schema/Schema'
import { parseEither } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { type Effect } from 'effect'
import { mapError } from 'effect/Effect'
import { runSync } from 'effect/Effect'
import type { NonEmptyReadonlyArray } from 'effect/ReadonlyArray'
import { type Hex, isHex } from 'viem'

/**
 * Type representing a valid HexString
 * @example
 * const validHexString = '0x1234567890abcdef1234567890abcdef12345678' as const
 */
export type HexString = Hex

/**
 * Effect/schema for {@link HexString} type
 * @example
 * const validHexString = '0x1234567890abcdef1234567890abcdef12345678' as const
 * const invalidHexString = 'not an hex'
 */
export const SHexString = string.pipe(
	filter(isHex, {
		message: (value) => `Invalid hex value: ${value}
See https://evmts.dev/reference/errors for more information.`,
	}),
)

/**
 * Returns true if a hex string is a valid hex string
 */
export const isHexString = (value: unknown): value is HexString => {
	return isHex(value)
}

/**
 * Error thrown when an invalid {@link HexString} is provided
 */
export class InvalidHexStringError extends TypeError {
	override name = InvalidHexStringError.name
	_tag = InvalidHexStringError.name
	constructor({
		value,
		cause,
		message = `Provided value ${value} is not a valid HexString`,
		docs = 'https://evmts.dev/reference/errors',
	}: {
		value: string
		message?: string
		docs?: string
		cause?: NonEmptyReadonlyArray<ParseErrors>
	}) {
		super(
			`${InvalidHexStringError.name}: ${message}
${docs}`,
			{ cause: cause && formatErrors(cause) },
		)
	}
}

/**
 * Parses an {@link HexString} safely into an Effect
 * @example
 * ```typescript
 * // $ExpectType Effect<never, InvalidHexStringError, HexString>
 * const hexEffect = parseHexStringSafe('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 */
export const parseHexStringSafe = <THexString extends HexString>(
	value: THexString,
): Effect.Effect<never, InvalidHexStringError, THexString> => {
	return parseEither(SHexString)(value).pipe(
		mapError(
			({ errors: cause }) => new InvalidHexStringError({ value, cause }),
		),
	) as Effect.Effect<never, InvalidHexStringError, THexString>
}

/**
 * Parses an {@link HexString} returning the hex or throwing an {@link InvalidHexStringError} if invalid
 * @example
 * ```typescript
 * // $ExpectType HexStringString
 * const hex = parseHexString('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 * @see {@link parseHexStringSafe} for an effect version
 */
export const parseHexStringString = <THexString extends HexString>(
	hex: THexString,
): THexString => {
	return runSync(parseHexStringSafe(hex))
}
