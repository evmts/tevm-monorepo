/**
 * @module HexString Schema
 * Types and validators for SHexString.
 */

import { filter, parseEither, string } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isHex } from 'viem'

/**
 * Type representing a valid HexString.
 * @typedef {string} HexString
 * @example
 * ```javascript
 * import { HexString } from '@evmts/schemas';
 * const hex = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies HexString;
 * ```
 */

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the HexString type.
 * @type {import('@effect/schema/Schema').Schema<string, HexString>}
 * @example
 * ```javascript
 * import { Schema } from '@effect/schema/Schema';
 * export const SHexString: Schema<string, HexString>;
 * ```
 */
export const SHexString =
	/** @type {import('@effect/schema/Schema').Schema<string, HexString>} */
	(
		string.pipe(
			filter(isHex, {
				message: (value) => `Invalid hex value: ${value}
See https://evmts.dev/reference/errors for more information.`,
			}),
		)
	)

/**
 * Type guard that returns true if a string is a valid hex string.
 */
export const isHexString = isHex

/**
 * Error thrown when an invalid HexString is provided.
 */
export class InvalidHexStringError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {unknown} [options.value] - The invalid hex value.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		value,
		message = `Provided value ${value} is not a valid HexString`,
		docs = 'https://evmts.dev/reference/errors',
		cause,
	} = {}) {
		super(`${InvalidHexStringError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses a HexString into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template THexString extends HexString
 * @param {THexString} value
 * @returns {Effect.Effect<never, InvalidHexStringError, THexString>}
 * @example
 * ```javascript
 * import { parseHexStringSafe } from '@evmts/schemas';
 * const parsedHexStringEffect = parseHexStringSafe('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseHexStringSafe = (value) => {
	const out =
		/** @type {Effect.Effect<never, InvalidHexStringError, THexString>} */
		(
			parseEither(SHexString)(value).pipe(
				mapError(
					({ errors: cause }) => new InvalidHexStringError({ value, cause }),
				),
			)
		)
	return out
}

/**
 * Parses a HexString and returns the value if no errors.
 * @template THexString extends HexString
 * @param {THexString} hex
 * @returns {THexString}
 * @example
 * ```javascript
 * import { parseHexString } from '@evmts/schemas';
 * const parsedHexString = parseHexString('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseHexString = (hex) => {
	return runSync(parseHexStringSafe(hex))
}
