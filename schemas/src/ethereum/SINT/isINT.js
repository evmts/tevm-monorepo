/**
 * @module @evmts/schemas/ethereum/SINT/isINT.js
 * @description Type guards for Solidity INT type
 * @author William Cory <willcory10@gmail.com>
 */

import { SINT8, SINT16, SINT32, SINT64, SINT128, SINT256 } from './SINT.js'
import { parseEither } from '@effect/schema/Schema'
import { isRight } from 'effect/Either'

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT8.
 * @param {unknown} int8
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT8 } from '@evmts/schemas';
 * isINT8(BigInt(-128));  // true
 * isINT8(BigInt(127));   // true
 * isINT8(BigInt(128));   // false
 * isINT8(BigInt(-129));  // false
 * ````
 */
export const isINT8 = (int8) => {
	return isRight(parseEither(SINT8)(int8))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT16.
 * @param {unknown} int16
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT16 } from '@evmts/schemas';
 * isINT16(BigInt(-32768));  // true
 * isINT16(BigInt(32767));   // true
 * isINT16(BigInt(32768));   // false
 * isINT16(BigInt(-32769));  // false
 * ````
 */
export const isINT16 = (int16) => {
	return isRight(parseEither(SINT16)(int16))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT32.
 * @param {unknown} int32
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT32 } from '@evmts/schemas';
 * isINT32(BigInt(-2147483648));  // true
 * isINT32(BigInt(2147483647));   // true
 * isINT32(BigInt(2147483648));   // false
 * isINT32(BigInt(-2147483649));  // false
 * ````
 */
export const isINT32 = (int32) => {
	return isRight(parseEither(SINT32)(int32))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT64.
 * @param {unknown} int64
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT64 } from '@evmts/schemas';
 * isINT64(BigInt("-9223372036854775808"));  // true
 * isINT64(BigInt("9223372036854775807"));   // true
 * isINT64(BigInt("9223372036854775808"));   // false
 * isINT64(BigInt("-9223372036854775809"));  // false
 * ````
 */
export const isINT64 = (int64) => {
	return isRight(parseEither(SINT64)(int64))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT128.
 * @param {unknown} int128
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT128 } from '@evmts/schemas';
 * isINT128(BigInt("-170141183460469231731687303715884105728"));  // true
 * isINT128(BigInt("170141183460469231731687303715884105727"));   // true
 * isINT128(BigInt("170141183460469231731687303715884105728"));   // false
 * isINT128(BigInt("-170141183460469231731687303715884105729"));  // false
 * ````
 */
export const isINT128 = (int128) => {
	return isRight(parseEither(SINT128)(int128))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT256.
 * @param {unknown} int256
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT256 } from '@evmts/schemas';
 * isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639936"));  // true
 * isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));   // true
 * isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639936"));   // false
 * isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639937"));  // false
 * ````
 */
export const isINT256 = (int256) => {
	return isRight(parseEither(SINT256)(int256))
}
