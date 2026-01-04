import { isHex } from './viem.js'
import { toBytes } from './viem.js'
import { bytesToBigInt, bytesToHex } from './viem.js'

/**
 * Enum for specifying the output type of the toType function.
 * Used for type conversions between different Ethereum data representations.
 *
 * @example
 * ```javascript
 * import { TypeOutput, toType } from '@tevm/utils'
 *
 * // Convert a hex string to BigInt
 * const bigintValue = toType('0x1234', TypeOutput.BigInt)
 *
 * // Convert to Uint8Array
 * const bytes = toType('0x1234', TypeOutput.Uint8Array)
 *
 * // Convert to prefixed hex string
 * const hex = toType(new Uint8Array([0x12, 0x34]), TypeOutput.PrefixedHexString)
 * ```
 * @type {{
 *   Number: 0,
 *   BigInt: 1,
 *   Uint8Array: 2,
 *   PrefixedHexString: 3
 * }}
 */
export const TypeOutput = /** @type {const} */ ({
	Number: 0,
	BigInt: 1,
	Uint8Array: 2,
	PrefixedHexString: 3,
})

/**
 * @typedef {0 | 1 | 2 | 3} TypeOutputValue
 */

/**
 * Converts various Ethereum data types (hex strings, numbers, bigints, Uint8Arrays)
 * to a specified output format.
 *
 * @example
 * ```javascript
 * import { toType, TypeOutput } from '@tevm/utils'
 *
 * // Convert hex string to BigInt
 * const gasLimit = toType('0x5208', TypeOutput.BigInt) // 21000n
 *
 * // Convert hex string to Number
 * const chainId = toType('0x1', TypeOutput.Number) // 1
 *
 * // Convert to Uint8Array
 * const data = toType('0xabcd', TypeOutput.Uint8Array) // Uint8Array([0xab, 0xcd])
 *
 * // Convert Uint8Array to hex string
 * const hex = toType(new Uint8Array([1, 2, 3]), TypeOutput.PrefixedHexString) // '0x010203'
 *
 * // Handles null/undefined gracefully
 * toType(null, TypeOutput.BigInt) // null
 * toType(undefined, TypeOutput.BigInt) // undefined
 * ```
 *
 * @template {TypeOutputValue} T
 * @param {string | number | bigint | Uint8Array | null | undefined} input - The value to convert
 * @param {T} outputType - The desired output type from TypeOutput enum
 * @returns {T extends 0 ? number : T extends 1 ? bigint : T extends 2 ? Uint8Array : T extends 3 ? string : never}
 * @throws {Error} If input is a non-0x-prefixed string, or if the number is unsafe for Number output
 */
export function toType(input, outputType) {
	if (input === null) {
		// @ts-expect-error - return type handles null
		return null
	}
	if (input === undefined) {
		// @ts-expect-error - return type handles undefined
		return undefined
	}

	if (typeof input === 'string' && !isHex(input)) {
		throw new Error(`A string must be provided with a 0x-prefix, given: ${input}`)
	} else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
		throw new Error('The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)')
	}

	// Handle Uint8Array directly since toBytes doesn't support it
	// Also handle Address objects which have a .bytes property
	let output
	if (input instanceof Uint8Array) {
		output = input
	} else if (typeof input === 'object' && input !== null && input.bytes instanceof Uint8Array) {
		// Handle Address-like objects with .bytes property
		output = input.bytes
	} else {
		output = toBytes(input)
	}

	switch (outputType) {
		case TypeOutput.Uint8Array:
			// @ts-expect-error - handled by overloads
			return output
		case TypeOutput.BigInt:
			// @ts-expect-error - handled by overloads
			return bytesToBigInt(output)
		case TypeOutput.Number: {
			const bigInt = bytesToBigInt(output)
			if (bigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
				throw new Error(
					'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)',
				)
			}
			// @ts-expect-error - handled by overloads
			return Number(bigInt)
		}
		case TypeOutput.PrefixedHexString:
			// @ts-expect-error - handled by overloads
			return bytesToHex(output)
		default:
			throw new Error('unknown outputType')
	}
}
