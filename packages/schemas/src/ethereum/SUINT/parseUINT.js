/**
 * @module @evmts/schemas/ethereum/SUINT/parseUINT.js
 * @description TypeSafe parser for Solidity UINT
 * @author William Cory <willcory10@gmail.com>
 */

import {
	parseUINT8Safe,
	parseUINT16Safe,
	parseUINT32Safe,
	parseUINT64Safe,
	parseUINT128Safe,
	parseUINT256Safe,
} from './parseUINTSafe.js'
import { runSync } from 'effect/Effect'

/**
 * Parses a UINT8 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT8} TUINT8
 * @param {TUINT8} uint8
 * @returns {TUINT8}
 * @example
 * ```ts
 * import { parseUINT8 } from '@evmts/schemas';
 * const parsedUINT8 = parseUINT8(BigInt(127));
 * ```
 */
export const parseUINT8 = (uint8) => {
	return runSync(parseUINT8Safe(uint8))
}
/**
 * Parses a UINT16 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT16} TUINT16
 * @param {TUINT16} uint16
 * @returns {TUINT16}
 * @example
 * ```ts
 * import { parseUINT16 } from '@evmts/schemas';
 * const parsedUINT16 = parseUINT16(BigInt(32767));
 * ```
 */
export const parseUINT16 = (uint16) => {
	return runSync(parseUINT16Safe(uint16))
}
/**
 * Parses a UINT32 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT32} TUINT32
 * @param {TUINT32} uint32
 * @returns {TUINT32}
 * @example
 * ```ts
 * import { parseUINT32 } from '@evmts/schemas';
 * const parsedUINT32 = parseUINT32(BigInt(2147483647));
 * ```
 */
export const parseUINT32 = (uint32) => {
	return runSync(parseUINT32Safe(uint32))
}
/**
 * Parses a UINT64 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT64} TUINT64
 * @param {TUINT64} uint64
 * @returns {TUINT64}
 * @example
 * ```ts
 * import { parseUINT64 } from '@evmts/schemas';
 * const parsedUINT64 = parseUINT64(BigInt("9223372036854775807"));
 * ```
 */
export const parseUINT64 = (uint64) => {
	return runSync(parseUINT64Safe(uint64))
}
/**
 * Parses a UINT128 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT128} TUINT128
 * @param {TUINT128} uint128
 * @returns {TUINT128}
 * @example
 * ```ts
 * import { parseUINT128 } from '@evmts/schemas';
 * const parsedUINT128 = parseUINT128(BigInt("170141183460469231731687303715884105727"));
 * ```
 */
export const parseUINT128 = (uint128) => {
	return runSync(parseUINT128Safe(uint128))
}
/**
 * Parses a UINT256 and returns the value if no errors.
 * @template {import("./SUINT.js").UINT256} TUINT256
 * @param {TUINT256} uint256
 * @returns {TUINT256}
 * @example
 * ```ts
 * import { parseUINT256 } from '@evmts/schemas';
 * const parsedUINT256 = parseUINT256('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseUINT256 = (uint256) => {
	return runSync(parseUINT256Safe(uint256))
}
