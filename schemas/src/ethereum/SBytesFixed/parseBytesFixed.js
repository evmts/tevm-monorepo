/**
 * @module @evmts/schemas/ethereum/FixedBytes/parseBytesFixed.js
 * @description TypeSafe parser for Solidity Fixed Bytes
 * @author William Cory <willcory10@gmail.com>
 */

import {
	parseBytes1Safe,
	parseBytes2Safe,
	parseBytes3Safe,
	parseBytes4Safe,
	parseBytes5Safe,
	parseBytes6Safe,
	parseBytes7Safe,
	parseBytes8Safe,
	parseBytes9Safe,
	parseBytes10Safe,
	parseBytes11Safe,
	parseBytes12Safe,
	parseBytes13Safe,
	parseBytes14Safe,
	parseBytes15Safe,
	parseBytes16Safe,
	parseBytes17Safe,
	parseBytes18Safe,
	parseBytes19Safe,
	parseBytes20Safe,
	parseBytes21Safe,
	parseBytes22Safe,
	parseBytes23Safe,
	parseBytes24Safe,
	parseBytes25Safe,
	parseBytes26Safe,
	parseBytes27Safe,
	parseBytes28Safe,
	parseBytes29Safe,
	parseBytes30Safe,
	parseBytes31Safe,
	parseBytes32Safe,
} from './parseBytesFixedSafe.js'
import { runSync } from 'effect/Effect'

/**
 * Parses a Bytes1 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes1} TBytes1
 * @param {TBytes1} bytes1
 * @returns {TBytes1}
 * @example
 * ```ts
 * import { parseBytes1 } from '@evmts/schemas';
 * const parsedBytes1 = parseBytes1('0xff');
 * ```
 */
export const parseBytes1 = (bytes1) => {
	return runSync(parseBytes1Safe(bytes1))
}

/**
 * Parses a Bytes2 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes2} TBytes2
 * @param {TBytes2} bytes2
 * @returns {TBytes2}
 * @example
 * ```ts
 * import { parseBytes2 } from '@evmts/schemas';
 * const parsedBytes2 = parseBytes2('0xffaa');
 * ```
 */
export const parseBytes2 = (bytes2) => {
	return runSync(parseBytes2Safe(bytes2))
}

/**
 * Parses a Bytes3 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes3} TBytes3
 * @param {TBytes3} bytes3
 * @returns {TBytes3}
 * @example
 * ```ts
 * import { parseBytes3 } from '@evmts/schemas';
 * const parsedBytes3 = parseBytes3('0xffaabb');
 * ```
 */
export const parseBytes3 = (bytes3) => {
	return runSync(parseBytes3Safe(bytes3))
}

/**
 * Parses a Bytes4 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes4} TBytes4
 * @param {TBytes4} bytes4
 * @returns {TBytes4}
 * @example
 * ```ts
 * import { parseBytes4 } from '@evmts/schemas';
 * const parsedBytes4 = parseBytes4('0xffaabbcc');
 * ```
 */
export const parseBytes4 = (bytes4) => {
	return runSync(parseBytes4Safe(bytes4))
}

/**
 * Parses a Bytes5 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes5} TBytes5
 * @param {TBytes5} bytes5
 * @returns {TBytes5}
 * @example
 * ```ts
 * import { parseBytes5 } from '@evmts/schemas';
 * const parsedBytes5 = parseBytes5('0xffaabbccdd');
 * ```
 */
export const parseBytes5 = (bytes5) => {
	return runSync(parseBytes5Safe(bytes5))
}
/**
 * Parses a Bytes6 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes6} TBytes6
 * @param {TBytes6} bytes6
 * @returns {TBytes6}
 * @example
 * ```ts
 * import { parseBytes6 } from '@evmts/schemas';
 * const parsedBytes6 = parseBytes6('0xffaabbccddeeff');
 * ```
 */
export const parseBytes6 = (bytes6) => {
	return runSync(parseBytes6Safe(bytes6))
}

/**
 * Parses a Bytes7 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes7} TBytes7
 * @param {TBytes7} bytes7
 * @returns {TBytes7}
 * @example
 * ```ts
 * import { parseBytes7 } from '@evmts/schemas';
 * const parsedBytes7 = parseBytes7('0xffaabbccddeeffaa');
 * ```
 */
export const parseBytes7 = (bytes7) => {
	return runSync(parseBytes7Safe(bytes7))
}

/**
 * Parses a Bytes8 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes8} TBytes8
 * @param {TBytes8} bytes8
 * @returns {TBytes8}
 * @example
 * ```ts
 * import { parseBytes8 } from '@evmts/schemas';
 * const parsedBytes8 = parseBytes8('0xffaabbccddeeffaabb');
 * ```
 */
export const parseBytes8 = (bytes8) => {
	return runSync(parseBytes8Safe(bytes8))
}

/**
 * Parses a Bytes9 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes9} TBytes9
 * @param {TBytes9} bytes9
 * @returns {TBytes9}
 * @example
 * ```ts
 * import { parseBytes9 } from '@evmts/schemas';
 * const parsedBytes9 = parseBytes9('0xffaabbccddeeffaabbcc');
 * ```
 */
export const parseBytes9 = (bytes9) => {
	return runSync(parseBytes9Safe(bytes9))
}

/**
 * Parses a Bytes10 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes10} TBytes10
 * @param {TBytes10} bytes10
 * @returns {TBytes10}
 * @example
 * ```ts
 * import { parseBytes10 } from '@evmts/schemas';
 * const parsedBytes = parseBytes10('0xffaabbccddeeffaabbccdd');
 */
export const parseBytes10 = (bytes10) => {
	return runSync(parseBytes10Safe(bytes10))
}

/**
 * Parses a Bytes11 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes11} TBytes11
 * @param {TBytes11} bytes11
 * @returns {TBytes11}
 * @example
 * ```ts
 * import { parseBytes11 } from '@evmts/schemas';
 * const parsedBytes11 = parseBytes11('0xffaabbccddeeffaabbccddaa');
 * ```
 */
export const parseBytes11 = (bytes11) => {
	return runSync(parseBytes11Safe(bytes11))
}

/**
 * Parses a Bytes12 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes12} TBytes12
 * @param {TBytes12} bytes12
 * @returns {TBytes12}
 * @example
 * ```ts
 * import { parseBytes12 } from '@evmts/schemas';
 * const parsedBytes12 = parseBytes12('0xffaabbccddeeffaabbccddaaee');
 * ```
 */
export const parseBytes12 = (bytes12) => {
	return runSync(parseBytes12Safe(bytes12))
}

/**
 * Parses a Bytes13 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes13} TBytes13
 * @param {TBytes13} bytes13
 * @returns {TBytes13}
 * @example
 * ```ts
 * import { parseBytes13 } from '@evmts/schemas';
 * const parsedBytes13 = parseBytes13('0xffaabbccddeeffaabbccddaaeeff');
 * ```
 */
export const parseBytes13 = (bytes13) => {
	return runSync(parseBytes13Safe(bytes13))
}

/**
 * Parses a Bytes14 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes14} TBytes14
 * @param {TBytes14} bytes14
 * @returns {TBytes14}
 * @example
 * ```ts
 * import { parseBytes14 } from '@evmts/schemas';
 * const parsedBytes14 = parseBytes14('0xffaabbccddeeffaabbccddaaeeffaa');
 * ```
 */
export const parseBytes14 = (bytes14) => {
	return runSync(parseBytes14Safe(bytes14))
}

/**
 * Parses a Bytes15 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes15} TBytes15
 * @param {TBytes15} bytes15
 * @returns {TBytes15}
 * @example
 * ```ts
 * import { parseBytes15 } from '@evmts/schemas';
 * const parsedBytes15 = parseBytes15('0xffaabbccddeeffaabbccddaaeeffaaee');
 * ```
 */
export const parseBytes15 = (bytes15) => {
	return runSync(parseBytes15Safe(bytes15))
}

/**
 * Parses a Bytes16 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes16} TBytes16
 * @param {TBytes16} bytes16
 * @returns {TBytes16}
 * @example
 * ```ts
 * import { parseBytes16 } from '@evmts/schemas';
 * const parsedBytes16 = parseBytes16('0xffaabbccddeeffaabbccddaaeeffaaeeff');
 * ```
 */
export const parseBytes16 = (bytes16) => {
	return runSync(parseBytes16Safe(bytes16))
}

/**
 * Parses a Bytes17 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes17} TBytes17
 * @param {TBytes17} bytes17
 * @returns {TBytes17}
 * @example
 * ```ts
 * import { parseBytes17 } from '@evmts/schemas';
 * const parsedBytes17 = parseBytes17('0xffaabbccddeeffaabbccddaaeeffaaeeffaa');
 * ```
 */
export const parseBytes17 = (bytes17) => {
	return runSync(parseBytes17Safe(bytes17))
}

/**
 * Parses a Bytes18 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes18} TBytes18
 * @param {TBytes18} bytes18
 * @returns {TBytes18}
 * @example
 * ```ts
 * import { parseBytes18 } from '@evmts/schemas';
 * const parsedBytes18 = parseBytes18('0xffaabbccddeeffaabbccddaaeeffaaeeffbb');
 * ```
 */
export const parseBytes18 = (bytes18) => {
	return runSync(parseBytes18Safe(bytes18))
}

/**
 * Parses a Bytes19 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes19} TBytes19
 * @param {TBytes19} bytes19
 * @returns {TBytes19}
 * @example
 * ```ts
 * import { parseBytes19 } from '@evmts/schemas';
 * const parsedBytes19 = parseBytes19('0xffaabbccddeeffaabbccddaaeeffaaeeffbbcc');
 * ```
 */
export const parseBytes19 = (bytes19) => {
	return runSync(parseBytes19Safe(bytes19))
}

/**
 * Parses a Bytes20 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes20} TBytes20
 * @param {TBytes20} bytes20
 * @returns {TBytes20}
 * @example
 * ```ts
 * import { parseBytes20 } from '@evmts/schemas';
 * const parsedBytes20 = parseBytes20('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccdd');
 * ```
 */
export const parseBytes20 = (bytes20) => {
	return runSync(parseBytes20Safe(bytes20))
}

/**
 * Parses a Bytes21 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes21} TBytes21
 * @param {TBytes21} bytes21
 * @returns {TBytes21}
 * @example
 * ```ts
 * import { parseBytes21 } from '@evmts/schemas';
 * const parsedBytes21 = parseBytes21('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddaa');
 * ```
 */
export const parseBytes21 = (bytes21) => {
	return runSync(parseBytes21Safe(bytes21))
}

/**
 * Parses a Bytes22 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes22} TBytes22
 * @param {TBytes22} bytes22
 * @returns {TBytes22}
 * @example
 * ```ts
 * import { parseBytes22 } from '@evmts/schemas';
 * const parsedBytes22 = parseBytes22('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddbb');
 * ```
 */
export const parseBytes22 = (bytes22) => {
	return runSync(parseBytes22Safe(bytes22))
}

/**
 * Parses a Bytes23 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes23} TBytes23
 * @param {TBytes23} bytes23
 * @returns {TBytes23}
 * @example
 * ```ts
 * import { parseBytes23 } from '@evmts/schemas';
 * const parsedBytes23 = parseBytes23('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddcc');
 * ```
 */
export const parseBytes23 = (bytes23) => {
	return runSync(parseBytes23Safe(bytes23))
}

/**
 * Parses a Bytes24 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes24} TBytes24
 * @param {TBytes24} bytes24
 * @returns {TBytes24}
 * @example
 * ```ts
 * import { parseBytes24 } from '@evmts/schemas';
 * const parsedBytes24 = parseBytes24('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbb');
 * ```
 */
export const parseBytes24 = (bytes24) => {
	return runSync(parseBytes24Safe(bytes24))
}

/**
 * Parses a Bytes25 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes25} TBytes25
 * @param {TBytes25} bytes25
 * @returns {TBytes25}
 * @example
 * ```ts
 * import { parseBytes25 } from '@evmts/schemas';
 * const parsedBytes25 = parseBytes25('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbdd');
 * ```
 */
export const parseBytes25 = (bytes25) => {
	return runSync(parseBytes25Safe(bytes25))
}

/**
 * Parses a Bytes26 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes26} TBytes26
 * @param {TBytes26} bytes26
 * @returns {TBytes26}
 * @example
 * ```ts
 * import { parseBytes26 } from '@evmts/schemas';
 * const parsedBytes26 = parseBytes26('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddaa');
 * ```
 */
export const parseBytes26 = (bytes26) => {
	return runSync(parseBytes26Safe(bytes26))
}

/**
 * Parses a Bytes27 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes27} TBytes27
 * @param {TBytes27} bytes27
 * @returns {TBytes27}
 * @example
 * ```ts
 * import { parseBytes27 } from '@evmts/schemas';
 * const parsedBytes27 = parseBytes27('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbb');
 * ```
 */
export const parseBytes27 = (bytes27) => {
	return runSync(parseBytes27Safe(bytes27))
}
/**
 * Parses a Bytes28 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes28} TBytes28
 * @param {TBytes28} bytes28
 * @returns {TBytes28}
 * @example
 * ```ts
 * import { parseBytes28 } from '@evmts/schemas';
 * const parsedBytes28 = parseBytes28('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbcc');
 * ```
 */
export const parseBytes28 = (bytes28) => {
	return runSync(parseBytes28Safe(bytes28))
}

/**
 * Parses a Bytes29 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes29} TBytes29
 * @param {TBytes29} bytes29
 * @returns {TBytes29}
 * @example
 * ```ts
 * import { parseBytes29 } from '@evmts/schemas';
 * const parsedBytes29 = parseBytes29('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaa');
 * ```
 */
export const parseBytes29 = (bytes29) => {
	return runSync(parseBytes29Safe(bytes29))
}

/**
 * Parses a Bytes30 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes30} TBytes30
 * @param {TBytes30} bytes30
 * @returns {TBytes30}
 * @example
 * ```ts
 * import { parseBytes30 } from '@evmts/schemas';
 * const parsedBytes30 = parseBytes30('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaa');
 * ```
 */
export const parseBytes30 = (bytes30) => {
	return runSync(parseBytes30Safe(bytes30))
}

/**
 * Parses a Bytes31 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes31} TBytes31
 * @param {TBytes31} bytes31
 * @returns {TBytes31}
 * @example
 * ```ts
 * import { parseBytes31 } from '@evmts/schemas';
 * const parsedBytes31 = parseBytes31('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaa');
 * ```
 */
export const parseBytes31 = (bytes31) => {
	return runSync(parseBytes31Safe(bytes31))
}

/**
 * Parses a Bytes32 and returns the value if no errors.
 * @template {import("./SBytesFixed.js").Bytes32} TBytes32
 * @param {TBytes32} bytes32
 * @returns {TBytes32}
 * @example
 * ```ts
 * import { parseBytes32 } from '@evmts/schemas';
 * const parsedBytes32 = parseBytes32('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaabb');
 * ```
 */
export const parseBytes32 = (bytes32) => {
	return runSync(parseBytes32Safe(bytes32))
}
