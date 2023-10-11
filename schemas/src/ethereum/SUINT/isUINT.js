/**
 * @module @evmts/schemas/ethereum/SUINT/isUINT.js
 * @description Type guards for Solidity UINT type
 * @author William Cory <willcory10@gmail.com>
 */

import {
	SUINT8,
	SUINT16,
	SUINT32,
	SUINT64,
	SUINT128,
	SUINT256,
} from './SUINT.js'
import { parseEither } from '@effect/schema/Schema'
import { isRight } from 'effect/Either'

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT8.
 * @param {unknown} uint8
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT8 } from '@evmts/schemas';
 * isUINT8(BigInt(127));  // true
 * isUINT8(BigInt(256));  // false
 * ````
 */
export const isUINT8 = (uint8) => {
	return isRight(parseEither(SUINT8)(uint8))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT16.
 * @param {unknown} uint16
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT16 } from '@evmts/schemas';
 * isUINT16(BigInt(32767));  // true
 * isUINT16(BigInt(65536));  // false
 * ````
 */
export const isUINT16 = (uint16) => {
	return isRight(parseEither(SUINT16)(uint16))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT32.
 * @param {unknown} uint32
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT32 } from '@evmts/schemas';
 * isUINT32(BigInt(2147483647));  // true
 * isUINT32(BigInt(4294967296));  // false
 * ````
 */
export const isUINT32 = (uint32) => {
	return isRight(parseEither(SUINT32)(uint32))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT64.
 * @param {unknown} uint64
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT64 } from '@evmts/schemas';
 * isUINT64(BigInt("9223372036854775807"));  // true
 * isUINT64(BigInt("18446744073709551616"));  // false
 * ````
 */
export const isUINT64 = (uint64) => {
	return isRight(parseEither(SUINT64)(uint64))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT128.
 * @param {unknown} uint128
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT128 } from '@evmts/schemas';
 * isUINT128(BigInt("170141183460469231731687303715884105727"));  // true
 * isUINT128(BigInt("340282366920938463463374607431768211456"));  // false
 * ````
 */
export const isUINT128 = (uint128) => {
	return isRight(parseEither(SUINT128)(uint128))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT256.
 * @param {unknown} uint256
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT256 } from '@evmts/schemas';
 * isUINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));  // true
 * isUINT256(BigInt("231584178474632390847141970017375815706539969331281128078915168015826259279872"));  // false
 * ````
 */
export const isUINT256 = (uint256) => {
	return isRight(parseEither(SUINT256)(uint256))
}
