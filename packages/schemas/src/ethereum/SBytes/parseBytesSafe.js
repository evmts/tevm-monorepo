/**
 * @module Bytes Schema
 * Types and validators for SBytes.
 */

import { InvalidBytesError } from './Errors.js'
import { SBytes } from './SBytes.js'
import { parseEither } from '@effect/schema/Schema'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'

/**
 * Safely parses a Bytes into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SBytes.js").Bytes} TBytes
 * @param {TBytes} value
 * @returns {Effect.Effect<never, InvalidBytesError, TBytes>}
 * @example
 * ```javascript
 * import { parseBytesSafe } from '@evmts/schemas';
 * const parsedBytesEffect = parseBytesSafe('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseBytesSafe = (value) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesError, TBytes>} */
		(
			parseEither(SBytes)(value).pipe(
				mapError(
					({ errors: cause }) => new InvalidBytesError({ value, cause }),
				),
			)
		)
	return out
}
