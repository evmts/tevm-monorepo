/**
 * @module @evmts/schemas/ethereum/FixedBytes/isFixedBytes.js
 * @description Type guards for Solidity FixedBytes type
 * @author William Cory <willcory10@gmail.com>
 * @todo some of the examples are copy pasta and wrong
 */

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
import { isRight } from 'effect/Either'

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes1.
 * @param {unknown} bytes1
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes1 } from '@evmts/schemas';
 * isBytes1("0xff");  // true
 * isBytes1("0xfff"); // false
 * ````
 */
export const isBytes1 = (bytes1) => {
	return isRight(parseEither(SBytes1)(bytes1))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes2.
 * @param {unknown} bytes2
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes2 } from '@evmts/schemas';
 * isBytes2("0xff");  // true
 * isBytes2("0xfff"); // false
 * ````
 */
export const isBytes2 = (bytes2) => {
	return isRight(parseEither(SBytes2)(bytes2))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes3.
 * @param {unknown} bytes3
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes3 } from '@evmts/schemas';
 * isBytes3("0xff");  // true
 * isBytes3("0xfff"); // false
 * ````
 */
export const isBytes3 = (bytes3) => {
	return isRight(parseEither(SBytes3)(bytes3))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes4.
 * @param {unknown} bytes4
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes4 } from '@evmts/schemas';
 * isBytes4("0xff");  // true
 * isBytes4("0xfff"); // false
 * ````
 */
export const isBytes4 = (bytes4) => {
	return isRight(parseEither(SBytes4)(bytes4))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes5.
 * @param {unknown} bytes5
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes5 } from '@evmts/schemas';
 * isBytes5("0xff");  // true
 * isBytes5("0xfff"); // false
 * ````
 */
export const isBytes5 = (bytes5) => {
	return isRight(parseEither(SBytes5)(bytes5))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes6.
 * @param {unknown} bytes6
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes6 } from '@evmts/schemas';
 * isBytes6("0xff");  // true
 * isBytes6("0xfff"); // false
 * ````
 */
export const isBytes6 = (bytes6) => {
	return isRight(parseEither(SBytes6)(bytes6))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes7.
 * @param {unknown} bytes7
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes7 } from '@evmts/schemas';
 * isBytes7("0xff");  // true
 * isBytes7("0xfff"); // false
 * ````
 */
export const isBytes7 = (bytes7) => {
	return isRight(parseEither(SBytes7)(bytes7))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes8.
 * @param {unknown} bytes8
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes8 } from '@evmts/schemas';
 * isBytes8("0xff");  // true
 * isBytes8("0xfff"); // false
 * ````
 */
export const isBytes8 = (bytes8) => {
	return isRight(parseEither(SBytes8)(bytes8))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes9.
 * @param {unknown} bytes9
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes9 } from '@evmts/schemas';
 * isBytes9("0xff");  // true
 * isBytes9("0xfff"); // false
 * ````
 */
export const isBytes9 = (bytes9) => {
	return isRight(parseEither(SBytes9)(bytes9))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes10.
 * @param {unknown} bytes10
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes10 } from '@evmts/schemas';
 * isBytes10("0xff");  // true
 * isBytes10("0xfff"); // false
 * ````
 */
export const isBytes10 = (bytes10) => {
	return isRight(parseEither(SBytes10)(bytes10))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes11.
 * @param {unknown} bytes11
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes11 } from '@evmts/schemas';
 * isBytes11("0xff");  // true
 * isBytes11("0xfff"); // false
 * ````
 */
export const isBytes11 = (bytes11) => {
	return isRight(parseEither(SBytes11)(bytes11))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes12.
 * @param {unknown} bytes12
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes12 } from '@evmts/schemas';
 * isBytes12("0xff");  // true
 * isBytes12("0xfff"); // false
 * ````
 */
export const isBytes12 = (bytes12) => {
	return isRight(parseEither(SBytes12)(bytes12))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes13.
 * @param {unknown} bytes13
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes13 } from '@evmts/schemas';
 * isBytes13("0xff");  // true
 * isBytes13("0xfff"); // false
 * ````
 */
export const isBytes13 = (bytes13) => {
	return isRight(parseEither(SBytes13)(bytes13))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes14.
 * @param {unknown} bytes14
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes14 } from '@evmts/schemas';
 * isBytes14("0xff");  // true
 * isBytes14("0xfff"); // false
 * ````
 */
export const isBytes14 = (bytes14) => {
	return isRight(parseEither(SBytes14)(bytes14))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes15.
 * @param {unknown} bytes15
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes15 } from '@evmts/schemas';
 * isBytes15("0xff");  // true
 * isBytes15("0xfff"); // false
 * ````
 */
export const isBytes15 = (bytes15) => {
	return isRight(parseEither(SBytes15)(bytes15))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes16.
 * @param {unknown} bytes16
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes16 } from '@evmts/schemas';
 * isBytes16("0xff");  // true
 * isBytes16("0xfff"); // false
 * ````
 */
export const isBytes16 = (bytes16) => {
	return isRight(parseEither(SBytes16)(bytes16))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes17.
 * @param {unknown} bytes17
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes17 } from '@evmts/schemas';
 * isBytes17("0xff");  // true
 * isBytes17("0xfff"); // false
 * ````
 */
export const isBytes17 = (bytes17) => {
	return isRight(parseEither(SBytes17)(bytes17))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes18.
 * @param {unknown} bytes18
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes18 } from '@evmts/schemas';
 * isBytes18("0xff");  // true
 * isBytes18("0xfff"); // false
 * ````
 */
export const isBytes18 = (bytes18) => {
	return isRight(parseEither(SBytes18)(bytes18))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes19.
 * @param {unknown} bytes19
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes19 } from '@evmts/schemas';
 * isBytes19("0xff");  // true
 * isBytes19("0xfff"); // false
 * ````
 */
export const isBytes19 = (bytes19) => {
	return isRight(parseEither(SBytes19)(bytes19))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes20.
 * @param {unknown} bytes20
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes20 } from '@evmts/schemas';
 * isBytes20("0xff");  // true
 * isBytes20("0xfff"); // false
 * ````
 */
export const isBytes20 = (bytes20) => {
	return isRight(parseEither(SBytes20)(bytes20))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes21.
 * @param {unknown} bytes21
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes21 } from '@evmts/schemas';
 * isBytes21("0xff");  // true
 * isBytes21("0xfff"); // false
 * ````
 */
export const isBytes21 = (bytes21) => {
	return isRight(parseEither(SBytes21)(bytes21))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes22.
 * @param {unknown} bytes22
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes22 } from '@evmts/schemas';
 * isBytes22("0xff");  // true
 * isBytes22("0xfff"); // false
 * ````
 */
export const isBytes22 = (bytes22) => {
	return isRight(parseEither(SBytes22)(bytes22))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes23.
 * @param {unknown} bytes23
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes23 } from '@evmts/schemas';
 * isBytes23("0xff");  // true
 * isBytes23("0xfff"); // false
 * ````
 */
export const isBytes23 = (bytes23) => {
	return isRight(parseEither(SBytes23)(bytes23))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes24.
 * @param {unknown} bytes24
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes24 } from '@evmts/schemas';
 * isBytes24("0xff");  // true
 * isBytes24("0xfff"); // false
 * ````
 */
export const isBytes24 = (bytes24) => {
	return isRight(parseEither(SBytes24)(bytes24))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes25.
 * @param {unknown} bytes25
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes25 } from '@evmts/schemas';
 * isBytes25("0xff");  // true
 * isBytes25("0xfff"); // false
 * ````
 */
export const isBytes25 = (bytes25) => {
	return isRight(parseEither(SBytes25)(bytes25))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes26.
 * @param {unknown} bytes26
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes26 } from '@evmts/schemas';
 * isBytes26("0xff");  // true
 * isBytes26("0xfff"); // false
 * ````
 */
export const isBytes26 = (bytes26) => {
	return isRight(parseEither(SBytes26)(bytes26))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes27.
 * @param {unknown} bytes27
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes27 } from '@evmts/schemas';
 * isBytes27("0xff");  // true
 * isBytes27("0xfff"); // false
 * ````
 */
export const isBytes27 = (bytes27) => {
	return isRight(parseEither(SBytes27)(bytes27))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes28.
 * @param {unknown} bytes28
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes28 } from '@evmts/schemas';
 * isBytes28("0xff");  // true
 * isBytesBytes2fff"); // false
 * ````
 */
export const isBytes28 = (bytes28) => {
	return isRight(parseEither(SBytes28)(bytes28))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes29.
 * @param {unknown} bytes29
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes29 } from '@evmts/schemas';
 * isBytes29("0xff");  // true
 * isBytes29("0xfff"); // false
 * ````
 */
export const isBytes29 = (bytes29) => {
	return isRight(parseEither(SBytes29)(bytes29))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes30.
 * @param {unknown} bytes30
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes30 } from '@evmts/schemas';
 * isBytes30("0xff");  // true
 * isBytes30("0xfff"); // false
 * ````
 */
export const isBytes30 = (bytes30) => {
	return isRight(parseEither(SBytes30)(bytes30))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes31.
 * @param {unknown} bytes31
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes31 } from '@evmts/schemas';
 * isBytes31("0xff");  // true
 * isBytes31("0xfff"); // false
 * ````
 */
export const isBytes31 = (bytes31) => {
	return isRight(parseEither(SBytes31)(bytes31))
}

/**
 * Type guard that returns true if the provided string is a valid Ethereum Bytes22.
 * @param {unknown} bytes32
 * @returns {boolean}
 * @example
 * ```ts
 * import { isBytes22 } from '@evmts/schemas';
 * isBytes22("0xff");  // true
 * isBytes22("0xfff"); // false
 * ````
 */
export const isBytes32 = (bytes32) => {
	return isRight(parseEither(SBytes32)(bytes32))
}
