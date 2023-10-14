/**
 * @module @evmts/schemas/ethereum/FixedBytes/parseBytesFixedSafe.js
 * @description Effect parser for Solidity FixedBytes
 * @author William Cory <willcory10@gmail.com>
 */

import { InvalidBytesFixedError } from './Errors.js'
import {
	SBytes1,
	SBytes2,
	SBytes3,
	SBytes4,
	SBytes5,
	SBytes6,
	SBytes7,
	SBytes8,
	SBytes9,
	SBytes10,
	SBytes11,
	SBytes12,
	SBytes13,
	SBytes14,
	SBytes15,
	SBytes16,
	SBytes17,
	SBytes18,
	SBytes19,
	SBytes20,
	SBytes21,
	SBytes22,
	SBytes23,
	SBytes24,
	SBytes25,
	SBytes26,
	SBytes27,
	SBytes28,
	SBytes29,
	SBytes30,
	SBytes31,
	SBytes32,
} from './SBytesFixed.js'
import { parseEither } from '@effect/schema/Schema'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'

/**
 * Safely parses a Bytes1 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes1 extends string
 * @param {TBytes1} bytes1
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes1>}
 */
export const parseBytes1Safe = (bytes1) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes1>} */
		(
			parseEither(SBytes1)(bytes1).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes1),
							size: 1,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes2 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes2 extends string
 * @param {TBytes2} bytes2
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes2>}
 */
export const parseBytes2Safe = (bytes2) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes2>} */
		(
			parseEither(SBytes2)(bytes2).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes2),
							size: 2,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes3 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes3 extends string
 * @param {TBytes3} bytes3
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes3>}
 */
export const parseBytes3Safe = (bytes3) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes3>} */
		(
			parseEither(SBytes3)(bytes3).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes3),
							size: 3,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes4 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes4 extends string
 * @param {TBytes4} bytes4
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes4>}
 */
export const parseBytes4Safe = (bytes4) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes4>} */
		(
			parseEither(SBytes4)(bytes4).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes4),
							size: 4,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes5 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes5 extends string
 * @param {TBytes5} bytes5
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes5>}
 */
export const parseBytes5Safe = (bytes5) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes5>} */
		(
			parseEither(SBytes5)(bytes5).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes5),
							size: 5,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes6 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes6 extends string
 * @param {TBytes6} bytes6
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes6>}
 */
export const parseBytes6Safe = (bytes6) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes6>} */
		(
			parseEither(SBytes6)(bytes6).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes6),
							size: 6,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes7 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes7 extends string
 * @param {TBytes7} bytes7
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes7>}
 */
export const parseBytes7Safe = (bytes7) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes7>} */
		(
			parseEither(SBytes7)(bytes7).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes7),
							size: 7,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes8 extends string
 * @param {TBytes8} bytes8
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes8>}
 */
export const parseBytes8Safe = (bytes8) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes8>} */
		(
			parseEither(SBytes8)(bytes8).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes8),
							size: 8,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes9 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes9 extends string
 * @param {TBytes9} bytes9
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes9>}
 */
export const parseBytes9Safe = (bytes9) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes9>} */
		(
			parseEither(SBytes9)(bytes9).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes9),
							size: 9,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes10 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes10 extends string
 * @param {TBytes10} bytes10
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes10>}
 */
export const parseBytes10Safe = (bytes10) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes10>} */
		(
			parseEither(SBytes10)(bytes10).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes10),
							size: 10,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes11 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes11 extends string
 * @param {TBytes11} bytes11
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes11>}
 */
export const parseBytes11Safe = (bytes11) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes11>} */
		(
			parseEither(SBytes11)(bytes11).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string*/ (bytes11),
							size: 11,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes12 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes12 extends string
 * @param {TBytes12} bytes12
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes12>}
 */
export const parseBytes12Safe = (bytes12) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes12>} */
		(
			parseEither(SBytes12)(bytes12).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes12),
							size: 12,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes13 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes13 extends string
 * @param {TBytes13} bytes13
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes13>}
 */
export const parseBytes13Safe = (bytes13) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes13>} */
		(
			parseEither(SBytes13)(bytes13).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes13),
							size: 13,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes14 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes14 extends string
 * @param {TBytes14} bytes14
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes14>}
 */
export const parseBytes14Safe = (bytes14) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes14>} */
		(
			parseEither(SBytes14)(bytes14).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes14),
							size: 14,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes15 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes15 extends string
 * @param {TBytes15} bytes15
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes15>}
 */
export const parseBytes15Safe = (bytes15) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes15>} */
		(
			parseEither(SBytes15)(bytes15).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes15),
							size: 15,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes16 extends string
 * @param {TBytes16} bytes16
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes16>}
 */
export const parseBytes16Safe = (bytes16) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes16>} */
		(
			parseEither(SBytes16)(bytes16).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes16),
							size: 16,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes17 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes17 extends string
 * @param {TBytes17} bytes17
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes17>}
 */
export const parseBytes17Safe = (bytes17) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes17>} */
		(
			parseEither(SBytes17)(bytes17).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes17),
							size: 17,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes18 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes18 extends string
 * @param {TBytes18} bytes18
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes18>}
 */
export const parseBytes18Safe = (bytes18) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes18>} */
		(
			parseEither(SBytes18)(bytes18).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes18),
							size: 18,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes19 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes19 extends string
 * @param {TBytes19} bytes19
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes19>}
 */
export const parseBytes19Safe = (bytes19) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes19>} */
		(
			parseEither(SBytes19)(bytes19).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes19),
							size: 19,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes20 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes20 extends string
 * @param {TBytes20} bytes20
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes20>}
 */
export const parseBytes20Safe = (bytes20) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes20>} */
		(
			parseEither(SBytes20)(bytes20).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes20),
							size: 20,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes21 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes21 extends string
 * @param {TBytes21} bytes21
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes21>}
 */
export const parseBytes21Safe = (bytes21) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes21>} */
		(
			parseEither(SBytes21)(bytes21).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes21),
							size: 21,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes22 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes22 extends string
 * @param {TBytes22} bytes22
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes22>}
 */
export const parseBytes22Safe = (bytes22) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes22>} */
		(
			parseEither(SBytes22)(bytes22).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes22),
							size: 22,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes23 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes23 extends string
 * @param {TBytes23} bytes23
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes23>}
 */
export const parseBytes23Safe = (bytes23) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes23>} */
		(
			parseEither(SBytes23)(bytes23).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes23),
							size: 23,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes24 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes24 extends string
 * @param {TBytes24} bytes24
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes24>}
 */
export const parseBytes24Safe = (bytes24) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes24>} */
		(
			parseEither(SBytes24)(bytes24).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes24),
							size: 24,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes25 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes25 extends string
 * @param {TBytes25} bytes25
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes25>}
 */
export const parseBytes25Safe = (bytes25) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes25>} */
		(
			parseEither(SBytes25)(bytes25).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes25),
							size: 25,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes26 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes26 extends string
 * @param {TBytes26} bytes26
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes26>}
 */
export const parseBytes26Safe = (bytes26) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes26>} */
		(
			parseEither(SBytes26)(bytes26).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes26),
							size: 26,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes27 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes27 extends string
 * @param {TBytes27} bytes27
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes27>}
 */
export const parseBytes27Safe = (bytes27) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes27>} */
		(
			parseEither(SBytes27)(bytes27).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes27),
							size: 27,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes28 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes28 extends string
 * @param {TBytes28} bytes28
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes28>}
 */
export const parseBytes28Safe = (bytes28) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes28>} */
		(
			parseEither(SBytes28)(bytes28).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes28),
							size: 28,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes29 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes29 extends string
 * @param {TBytes29} bytes29
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes29>}
 */
export const parseBytes29Safe = (bytes29) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes29>} */
		(
			parseEither(SBytes29)(bytes29).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes29),
							size: 29,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes30 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes30 extends string
 * @param {TBytes30} bytes30
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes30>}
 */
export const parseBytes30Safe = (bytes30) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes30>} */
		(
			parseEither(SBytes30)(bytes30).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes30),
							size: 30,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes31 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes31 extends string
 * @param {TBytes31} bytes31
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes31>}
 */
export const parseBytes31Safe = (bytes31) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes31>} */
		(
			parseEither(SBytes31)(bytes31).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes31),
							size: 31,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses a Bytes32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TBytes32 extends string
 * @param {TBytes32} bytes32
 * @returns {Effect.Effect<never, InvalidBytesFixedError, TBytes32>}
 */
export const parseBytes32Safe = (bytes32) => {
	const out =
		/** @type {Effect.Effect<never, InvalidBytesFixedError, TBytes32>} */
		(
			parseEither(SBytes32)(bytes32).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidBytesFixedError({
							bytes: /** @type string */ (bytes32),
							size: 32,
							cause,
						}),
				),
			)
		)
	return out
}
