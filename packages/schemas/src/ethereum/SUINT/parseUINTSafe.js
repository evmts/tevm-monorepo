/**
 * @module @evmts/schemas/ethereum/SUINT/parseUINTSafe.js
 * @description Effect parser for Solidity UINT
 * @author William Cory <willcory10@gmail.com>
 */

import { InvalidUINTError } from './Errors.js'
import {
	SUINT8,
	SUINT16,
	SUINT32,
	SUINT64,
	SUINT128,
	SUINT256,
} from './SUINT.js'
import { parseEither } from '@effect/schema/Schema'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'

/**
 * Safely parses a UINT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT8} TUINT8
 * @param {TUINT8} uint8
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT8>}
 */
export const parseUINT8Safe = (uint8) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT8>} */
		(
			parseEither(SUINT8)(uint8).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint8),
							size: 8,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT16} TUINT16
 * @param {TUINT16} uint16
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT16>}
 */
export const parseUINT16Safe = (uint16) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT16>} */
		(
			parseEither(SUINT16)(uint16).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint16),
							size: 16,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT32} TUINT32
 * @param {TUINT32} uint32
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT32>}
 */
export const parseUINT32Safe = (uint32) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT32>} */
		(
			parseEither(SUINT32)(uint32).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint32),
							size: 32,
							cause,
						}),
				),
			)
		)
	return out
}

// For UINT64
/**
 * Safely parses a UINT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT64} TUINT64
 * @param {TUINT64} uint64
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT64>}
 */
export const parseUINT64Safe = (uint64) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT64>} */
		(
			parseEither(SUINT64)(uint64).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint64),
							size: 64,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT128} TUINT128
 * @param {TUINT128} uint128
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT128>}
 */
export const parseUINT128Safe = (uint128) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT128>} */
		(
			parseEither(SUINT128)(uint128).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint128),
							size: 128,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SUINT.js").UINT256} TUINT256
 * @param {TUINT256} uint256
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT256>}
 * @example
 * ```ts
 * import { parseUINT256Safe } from '@evmts/schemas';
 * const parsedUINT256Effect = parseUINT256Safe('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseUINT256Safe = (uint256) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT256>} */
		(
			parseEither(SUINT256)(uint256).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint256),
							size: 256,
							cause,
						}),
				),
			)
		)
	return out
}
