/**
 * @module @evmts/schemas/ethereum/SINT/parseINT.js
 * @description TypeSafe parser for Solidity INT
 * @author William Cory <willcory10@gmail.com>
 */

import {
	parseINT8Safe,
	parseINT16Safe,
	parseINT32Safe,
	parseINT64Safe,
	parseINT128Safe,
	parseINT256Safe,
} from './parseINTSafe.js'
import { runSync } from 'effect/Effect'

/**
 * Parses an INT8 and returns the value if no errors.
 * @template {import("./SINT.js").INT8} TINT8 extends INT8
 * @param {TINT8} int8
 * @returns {TINT8}
 * @example
 * ```ts
 * import { parseInt8 } from '@evmts/schemas';
 * const parsedINT8 = parseInt8(BigInt(-128));
 * ```
 */
export const parseInt8 = (int8) => {
	return runSync(parseINT8Safe(int8))
}

/**
 * Parses an INT16 and returns the value if no errors.
 * @template {import("./SINT.js").INT16} TINT16
 * @param {TINT16} int16
 * @returns {TINT16}
 * @example
 * ```ts
 * import { parseInt16 } from '@evmts/schemas';
 * const parsedINT16 = parseInt16(BigInt(-32768));
 * ```
 */
export const parseInt16 = (int16) => {
	return runSync(parseINT16Safe(int16))
}

/**
 * Parses an INT32 and returns the value if no errors.
 * @template {import("./SINT.js").INT32} TINT32
 * @param {TINT32} int32
 * @returns {TINT32}
 * @example
 * ```ts
 * import { parseInt32 } from '@evmts/schemas';
 * const parsedINT32 = parseInt32(BigInt(-2147483648));
 * ```
 */
export const parseInt32 = (int32) => {
	return runSync(parseINT32Safe(int32))
}

/**
 * Parses an INT64 and returns the value if no errors.
 * @template {import("./SINT.js").INT64} TINT64
 * @param {TINT64} int64
 * @returns {TINT64}
 * @example
 * ```ts
 * import { parseInt64 } from '@evmts/schemas';
 * const parsedINT64 = parseInt64(BigInt("-9223372036854775808"));
 * ```
 */
export const parseInt64 = (int64) => {
	return runSync(parseINT64Safe(int64))
}

/**
 * Parses an INT128 and returns the value if no errors.
 * @template {import("./SINT.js").INT128} TINT128
 * @param {TINT128} int128
 * @returns {TINT128}
 * @example
 * ```ts
 * import { parseInt128 } from '@evmts/schemas';
 * const parsedINT128 = parseInt128(BigInt("-170141183460469231731687303715884105728"));
 * ```
 */
export const parseInt128 = (int128) => {
	return runSync(parseINT128Safe(int128))
}

/**
 * Parses an INT256 and returns the value if no errors.
 * @template {import("./SINT.js").INT256} TINT256
 * @param {TINT256} int256
 * @returns {TINT256}
 * @example
 * ```ts
 * import { parseInt256 } from '@evmts/schemas';
 * const parsedINT256 = parseInt256(420n);
 * ```
 */
export const parseInt256 = (int256) => {
	return runSync(parseINT256Safe(int256))
}
