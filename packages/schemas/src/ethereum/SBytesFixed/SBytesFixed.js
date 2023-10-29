/**
 * @module @evmts/schemas/ethereum/SBytesFixed/SBytesFixed.js
 * @description Types and validators for Solidity BytesFixed
 * @author William Cory <willcory10@gmail.com>
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */

import { filter, string } from '@effect/schema/Schema'
import { isHex } from 'viem'

/**
 * returns true if the given hex string is a valid bytes of fixed length
 * @param {string} hexString
 * @param {number} length
 * @returns {boolean}
 * @example
 * isBytesFixed('0x1234567890abcdef', 8) // true
 * isBytesFixed('0x1234567890abcdef', 7) // false
 */
const isRightLength = (hexString, length) => {
	return hexString.length === length * 2 + 2
}

/**
 * Type representing a valid Bytes1.
 * A valid Bytes1 is a `string` of form "0x" followed by 2 characters.
 * @typedef {`0x${string}`} Bytes1
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes2.
 * A valid Bytes2 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes2
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes3.
 * A valid Bytes3 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes3
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes4.
 * A valid Bytes4 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes4
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes5.
 * A valid Bytes5 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes5
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes6.
 * A valid Bytes6 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes6
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes7.
 * A valid Bytes7 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes7
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes8.
 * A valid Bytes8 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes8
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes9.
 * A valid Bytes9 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes9
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes10.
 * A valid Bytes10 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes10
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes11.
 * A valid Bytes11 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes11
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes12.
 * A valid Bytes12 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes12
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes13.
 * A valid Bytes13 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes13
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes14.
 * A valid Bytes14 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes14
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes15.
 * A valid Bytes15 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes15
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes16.
 * A valid Bytes16 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes16
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes17.
 * A valid Bytes17 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes17
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes18.
 * A valid Bytes18 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes18
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes19.
 * A valid Bytes19 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes19
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes20.
 * A valid Bytes20 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes20
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes21.
 * A valid Bytes21 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes21
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes22.
 * A valid Bytes22 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes22
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes23.
 * A valid Bytes23 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes23
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes24.
 * A valid Bytes24 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes24
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes25.
 * A valid Bytes25 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes25
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes26.
 * A valid Bytes26 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes26
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes27.
 * A valid Bytes27 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes27
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes28.
 * A valid Bytes28 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes28
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes29.
 * A valid Bytes29 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes29
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes30.
 * A valid Bytes30 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes30
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes31.
 * A valid Bytes31 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes31
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
/**
 * Type representing a valid Bytes32.
 * A valid Bytes32 is a `string` of form "0x" followed by 4 characters.
 * @typedef {`0x${string}`} Bytes32
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes1 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes1>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes1 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 1), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes2 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes2>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes2 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 2), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes3 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes3>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes3 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 3), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes4 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes4>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes4 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 4), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes5 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes5>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes5 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 5), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes6 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes6>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes6 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 6), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes7 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes7>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes7 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 7), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes8 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes8>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes8 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 8), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes9 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes9>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes9 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 9), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes10 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes10>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes10 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 10), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes11 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes11>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes11 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 11), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes12 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes12>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes12 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 12), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes13 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes13>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes13 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 13), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes14 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes14>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes14 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 14), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes15 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes15>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes15 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 15), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes16 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes16>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes16 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 16), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes17 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes17>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes17 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 17), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes18 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes18>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes18 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 18), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes19 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes19>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes19 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 19), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes20 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes20>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes20 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 20), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes21 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes21>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes21 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 21), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes22 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes22>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes22 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 22), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes23 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes23>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes23 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 23), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes24 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes24>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes24 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 24), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes25 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes25>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes25 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 25), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes26 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes26>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes26 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 26), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes27 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes27>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes27 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 27), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes28 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes28>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes28 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 28), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes29 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes29>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes29 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 29), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes30 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes30>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes30 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 30), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes31 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes31>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes31 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 31), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes32 type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes32>}
 * {@link https://docs.soliditylang.org/en/latest/types.html#fixed-size-byte-arrays Solidity docs}
 */
export const SBytes32 = string.pipe(
	filter(isHex, {
		message: (address) => `Invalid hex string: ${address}`,
	}),
	filter((value) => isRightLength(value, 32), {
		message: (address) => `Invalid hex string: ${address}`,
	}),
)
