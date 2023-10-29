/**
 * @module @evmts/schemas/ethereum/SINT/parseINTSafe.js
 * @description Effect parser for Solidity INT
 * @author William Cory <willcory10@gmail.com>
 */

import { InvalidINTError } from './Errors.js'
import { SINT8, SINT16, SINT32, SINT64, SINT128, SINT256 } from './SINT.js'
import { parseEither } from '@effect/schema/Schema'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'

/**
 * Safely parses an INT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT8 extends bigint
 * @param {TINT8} int8
 * @returns {Effect.Effect<never, InvalidINTError, TINT8>}
 */
export const parseINT8Safe = (int8) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT8>} */
		(
			parseEither(SINT8)(int8).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int8),
							size: 8,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT16 extends bigint
 * @param {TINT16} int16
 * @returns {Effect.Effect<never, InvalidINTError, TINT16>}
 */
export const parseINT16Safe = (int16) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT16>} */
		(
			parseEither(SINT16)(int16).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int16),
							size: 16,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT32 extends bigint
 * @param {TINT32} int32
 * @returns {Effect.Effect<never, InvalidINTError, TINT32>}
 */
export const parseINT32Safe = (int32) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT32>} */
		(
			parseEither(SINT32)(int32).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int32),
							size: 32,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT64 extends bigint
 * @param {TINT64} int64
 * @returns {Effect.Effect<never, InvalidINTError, TINT64>}
 */
export const parseINT64Safe = (int64) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT64>} */
		(
			parseEither(SINT64)(int64).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int64),
							size: 64,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT128 extends bigint
 * @param {TINT128} int128
 * @returns {Effect.Effect<never, InvalidINTError, TINT128>}
 */
export const parseINT128Safe = (int128) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT128>} */
		(
			parseEither(SINT128)(int128).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int128),
							size: 128,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT256 extends bigint
 * @param {TINT256} int256
 * @returns {Effect.Effect<never, InvalidINTError, TINT256>}
 */
export const parseINT256Safe = (int256) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT256>} */
		(
			parseEither(SINT256)(int256).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int256),
							size: 256,
							cause,
						}),
				),
			)
		)
	return out
}
