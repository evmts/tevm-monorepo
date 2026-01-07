// @ts-nocheck - Using @ts-nocheck because voltaire types are not available yet
/**
 * @module address
 * Native Address class implementation for tevm, replacing @ethereumjs/util Address.
 * Provides an Ethereum address handling class compatible with the ethereumjs API.
 */

import { equalsBytes } from './equalsBytes.js'
import { setLengthLeft } from './setLengthLeft.js'
import { BIGINT_0 } from './constants.js'

/**
 * Lookup table for converting hex characters to their numeric value.
 * @type {Record<string, number>}
 */
const hexCharToValue = {
	'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
	'8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
	'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
}

/**
 * Convert hex string to bytes.
 * @param {string} hex - The hex string to convert
 * @returns {Uint8Array} The byte array
 */
function hexToBytes(hex) {
	const hexStr = hex.startsWith('0x') ? hex.slice(2) : hex
	const bytes = new Uint8Array(hexStr.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		const hi = hexCharToValue[hexStr[i * 2]]
		const lo = hexCharToValue[hexStr[i * 2 + 1]]
		if (hi === undefined || lo === undefined) {
			throw new Error(`Invalid hex character at position ${i * 2}`)
		}
		bytes[i] = (hi << 4) | lo
	}
	return bytes
}

/**
 * Convert bytes to hex string.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {string} The hex string (with 0x prefix)
 */
function bytesToHex(bytes) {
	let hex = '0x'
	for (let i = 0; i < bytes.length; i++) {
		const byte = bytes[i]
		hex += byte.toString(16).padStart(2, '0')
	}
	return hex
}

/**
 * Convert bytes to bigint.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {bigint} The bigint value
 */
function bytesToBigInt(bytes) {
	if (bytes.length === 0) return 0n
	let hex = '0x'
	for (let i = 0; i < bytes.length; i++) {
		hex += bytes[i].toString(16).padStart(2, '0')
	}
	return BigInt(hex)
}

/**
 * Convert bigint to bytes.
 * @param {bigint} value - The bigint to convert
 * @returns {Uint8Array} The bytes
 */
function bigIntToBytes(value) {
	if (value === 0n) return new Uint8Array([0])
	let hex = value.toString(16)
	if (hex.length % 2) hex = '0' + hex
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Checks if a given address is valid.
 * @param {string} hexAddress - The address to validate
 * @returns {boolean} True if valid
 */
function isValidAddress(hexAddress) {
	if (typeof hexAddress !== 'string') return false
	return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

/**
 * Handling and generating Ethereum addresses.
 *
 * This class provides a native implementation compatible with the @ethereumjs/util Address class.
 * It wraps a 20-byte Uint8Array representing an Ethereum address.
 *
 * @example
 * ```javascript
 * import { Address, createAddressFromString } from '@tevm/utils'
 *
 * // Create from hex string
 * const address = createAddressFromString('0x1234567890123456789012345678901234567890')
 *
 * // Check if address is zero
 * console.log(address.isZero()) // false
 *
 * // Get hex string representation
 * console.log(address.toString()) // '0x1234567890123456789012345678901234567890'
 *
 * // Get bytes representation
 * console.log(address.toBytes()) // Uint8Array(20)
 * ```
 */
export class Address {
	/**
	 * The 20-byte address bytes.
	 * @type {Uint8Array}
	 */
	bytes

	/**
	 * Creates an Address object.
	 * @param {Uint8Array} bytes - 20-byte address bytes
	 * @throws {Error} If bytes is not exactly 20 bytes
	 */
	constructor(bytes) {
		if (bytes.length !== 20) {
			throw new Error('Invalid address length')
		}
		this.bytes = bytes
	}

	/**
	 * Is address equal to another.
	 * @param {Address} address - The address to compare
	 * @returns {boolean} True if addresses are equal
	 */
	equals(address) {
		return equalsBytes(this.bytes, address.bytes)
	}

	/**
	 * Is address zero.
	 * @returns {boolean} True if this is the zero address
	 */
	isZero() {
		return this.equals(new Address(new Uint8Array(20)))
	}

	/**
	 * True if address is in the address range defined by EIP-1352 (precompiles and system addresses).
	 * @returns {boolean} True if address is a precompile or system address
	 */
	isPrecompileOrSystemAddress() {
		const address = bytesToBigInt(this.bytes)
		const rangeMin = BIGINT_0
		const rangeMax = BigInt('0xffff')
		return address >= rangeMin && address <= rangeMax
	}

	/**
	 * Returns hex encoding of address.
	 * @returns {string} The checksummed hex address
	 */
	toString() {
		return bytesToHex(this.bytes)
	}

	/**
	 * Returns a new Uint8Array representation of address.
	 * @returns {Uint8Array} A copy of the address bytes
	 */
	toBytes() {
		return new Uint8Array(this.bytes)
	}
}

/**
 * Returns the zero address.
 * @returns {Address} The zero address
 * @example
 * ```javascript
 * import { createZeroAddress } from '@tevm/utils'
 * const zero = createZeroAddress()
 * console.log(zero.toString()) // '0x0000000000000000000000000000000000000000'
 * ```
 */
export function createZeroAddress() {
	return new Address(new Uint8Array(20))
}

/**
 * Returns an Address object from a bigint address (they are stored as bigints on the stack).
 * @param {bigint} value - The bigint address
 * @returns {Address} The Address object
 * @throws {Error} If the bigint value is too large for an address
 * @example
 * ```javascript
 * import { createAddressFromBigInt } from '@tevm/utils'
 * const address = createAddressFromBigInt(0x1234567890123456789012345678901234567890n)
 * console.log(address.toString()) // '0x1234567890123456789012345678901234567890'
 * ```
 */
export function createAddressFromBigInt(value) {
	const bytes = bigIntToBytes(value)
	if (bytes.length > 20) {
		throw new Error(`Invalid address, too long: ${bytes.length}`)
	}
	return new Address(setLengthLeft(bytes, 20))
}

/**
 * Returns an Address object from a hex-encoded string.
 * @param {string} str - Hex-encoded address (must be 0x-prefixed and 40 hex chars)
 * @returns {Address} The Address object
 * @throws {Error} If the string is not a valid address
 * @example
 * ```javascript
 * import { createAddressFromString } from '@tevm/utils'
 * const address = createAddressFromString('0x1234567890123456789012345678901234567890')
 * console.log(address.isZero()) // false
 * ```
 */
export function createAddressFromString(str) {
	if (!isValidAddress(str)) {
		throw new Error(`Invalid address input=${str}`)
	}
	return new Address(hexToBytes(str))
}
