// @tevm/utils - Native implementations with minimal viem dependencies
//
// Migration status (using @tevm/voltaire):
// ✅ COMPLETED: ABI encoding/decoding (encodeAbiParameters, decodeAbiParameters, encodeFunctionData, etc.)
// ✅ COMPLETED: All utility functions (hex conversions, RLP, keccak256, etc.)
// ✅ COMPLETED: formatAbi (native implementation)
// 🔄 REMAINING: parseAbi (from abitype - complex human-readable ABI parser)
// 🔄 REMAINING: mnemonicToAccount/privateKeyToAccount (viem account objects with signing methods)
// 🔄 REMAINING: Transport/client functions for forking (createPublicClient, http, etc.)
//
// Note: abitype and viem/accounts are kept as they provide complex functionality
// that would require significant effort to replicate without clear benefit.

// ABI formatting - native implementation
export { formatAbi } from './formatAbi.js'

// ABI parsing from abitype (human-readable ABI -> JSON ABI)
export { parseAbi } from 'abitype'

// Account creation from viem (HD wallet derivation, signing methods)
export { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'

/**
 * Re-export viem's PrivateKeyAccount type for account management.
 * @typedef {import('viem/accounts').PrivateKeyAccount} PrivateKeyAccount
 */

// Native privateKeyToAddress implementation using @tevm/voltaire
export { privateKeyToAddress } from './privateKeyToAddress.js'

// Native generatePrivateKey implementation
export { generatePrivateKey } from './generatePrivateKey.js'
import { hash as keccak256Hash } from '@tevm/voltaire/Keccak256'

/**
 * Convert bytes to hex string.
 * Native implementation that matches viem's bytesToHex API.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {import('./hex-types.js').Hex} The hex string (e.g., '0x1234')
 * @example
 * ```javascript
 * import { bytesToHex } from '@tevm/utils'
 * const bytes = new Uint8Array([0x12, 0x34])
 * const hex = bytesToHex(bytes) // '0x1234'
 * ```
 */
export function bytesToHex(bytes) {
	let hex = '0x'
	for (let i = 0; i < bytes.length; i++) {
		const byte = /** @type {number} */ (bytes[i])
		hex += byte.toString(16).padStart(2, '0')
	}
	return /** @type {import('./hex-types.js').Hex} */ (hex)
}

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
 * Convert hex string to BigInt.
 * Native implementation that matches viem's hexToBigInt API.
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must start with '0x')
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to treat as signed integer
 * @returns {bigint} The BigInt value
 * @example
 * ```javascript
 * import { hexToBigInt } from '@tevm/utils'
 * const hex = '0x1234'
 * const value = hexToBigInt(hex) // 4660n
 * ```
 */
export function hexToBigInt(hex, opts) {
	if (typeof hex !== 'string' || !hex.startsWith('0x')) {
		throw new Error(`Invalid hex value: ${hex}`)
	}
	const hexDigits = hex.slice(2)
	// Handle empty hex string '0x' or '0x0'
	if (hexDigits.length === 0 || hexDigits === '0') {
		return 0n
	}
	// For signed integers (two's complement)
	if (opts?.signed) {
		const size = Math.ceil(hexDigits.length / 2)
		const value = BigInt(hex)
		const maxPositive = (1n << (BigInt(size) * 8n - 1n)) - 1n
		if (value > maxPositive) {
			return value - (1n << (BigInt(size) * 8n))
		}
		return value
	}
	return BigInt(hex)
}

/**
 * Convert hex string to bytes.
 * Native implementation that matches viem's hexToBytes API.
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must start with '0x')
 * @returns {Uint8Array} The byte array
 * @throws {Error} If the hex string is invalid
 * @example
 * ```javascript
 * import { hexToBytes } from '@tevm/utils'
 * const hex = '0x1234'
 * const bytes = hexToBytes(hex) // Uint8Array([0x12, 0x34])
 * ```
 */
export function hexToBytes(hex) {
	if (typeof hex !== 'string' || !hex.startsWith('0x')) {
		throw new Error(`Invalid hex value: ${hex}`)
	}
	const hexDigits = hex.slice(2)
	// Handle empty hex string '0x'
	if (hexDigits.length === 0) {
		return new Uint8Array(0)
	}
	// Pad odd-length hex strings (viem allows this)
	const paddedHex = hexDigits.length % 2 === 0 ? hexDigits : `0${hexDigits}`
	const bytes = new Uint8Array(paddedHex.length / 2)
	for (let i = 0; i < paddedHex.length; i += 2) {
		const highChar = /** @type {string} */ (paddedHex[i])
		const lowChar = /** @type {string} */ (paddedHex[i + 1])
		const high = hexCharToValue[highChar]
		const low = hexCharToValue[lowChar]
		if (high === undefined || low === undefined) {
			throw new Error(`Invalid hex character in: ${hex}`)
		}
		bytes[i / 2] = high * 16 + low
	}
	return bytes
}

/**
 * Convert hex string to number.
 * Native implementation that matches viem's hexToNumber API.
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must start with '0x')
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to treat as signed integer
 * @returns {number} The number value
 * @throws {Error} If the hex string is invalid or the value is too large for a safe integer
 * @example
 * ```javascript
 * import { hexToNumber } from '@tevm/utils'
 * const hex = '0xff'
 * const value = hexToNumber(hex) // 255
 * ```
 */
export function hexToNumber(hex, opts) {
	const bigIntValue = hexToBigInt(hex, opts)
	// Check for safe integer range
	if (bigIntValue > BigInt(Number.MAX_SAFE_INTEGER) || bigIntValue < BigInt(Number.MIN_SAFE_INTEGER)) {
		throw new Error(`Value ${bigIntValue} is outside safe integer range`)
	}
	return Number(bigIntValue)
}

/**
 * Convert number to hex string.
 * Native implementation that matches viem's numberToHex API.
 * @param {number | bigint} value - The number or bigint to convert
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to encode as signed integer
 * @param {number} [opts.size] - Size in bytes (for padding/signed encoding)
 * @returns {import('./hex-types.js').Hex} The hex string (e.g., '0xff')
 * @example
 * ```javascript
 * import { numberToHex } from '@tevm/utils'
 * const value = 255
 * const hex = numberToHex(value) // '0xff'
 * const padded = numberToHex(255, { size: 2 }) // '0x00ff'
 * ```
 */
export function numberToHex(value, opts) {
	const bigIntValue = typeof value === 'bigint' ? value : BigInt(value)

	// Handle signed encoding
	if (opts?.signed) {
		const size = opts.size
		if (size === undefined) {
			throw new Error('Size is required for signed encoding')
		}
		const maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n
		const minValue = -(1n << (BigInt(size) * 8n - 1n))
		if (bigIntValue > maxValue || bigIntValue < minValue) {
			throw new Error(`Value ${bigIntValue} is out of range for ${size} byte signed integer`)
		}
		// Two's complement for negative numbers
		let encoded = bigIntValue
		if (bigIntValue < 0n) {
			encoded = (1n << (BigInt(size) * 8n)) + bigIntValue
		}
		return /** @type {import('./hex-types.js').Hex} */ (`0x${encoded.toString(16).padStart(size * 2, '0')}`)
	}

	// For unsigned, ensure non-negative
	if (bigIntValue < 0n) {
		throw new Error(`Negative value ${bigIntValue} cannot be encoded as unsigned hex`)
	}

	// Handle size padding
	if (opts?.size) {
		const hex = bigIntValue.toString(16)
		const expectedLength = opts.size * 2
		if (hex.length > expectedLength) {
			throw new Error(`Value ${bigIntValue} exceeds ${opts.size} byte size`)
		}
		return /** @type {import('./hex-types.js').Hex} */ (`0x${hex.padStart(expectedLength, '0')}`)
	}

	// Default: no padding, just convert
	return /** @type {import('./hex-types.js').Hex} */ (`0x${bigIntValue.toString(16)}`)
}

/**
 * Convert boolean to hex string.
 * Native implementation that matches viem's boolToHex API.
 * @param {boolean} value - The boolean value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding (e.g., 32 for ABI encoding)
 * @returns {import('./hex-types.js').Hex} The hex string ('0x1' for true, '0x0' for false)
 * @example
 * ```javascript
 * import { boolToHex } from '@tevm/utils'
 * boolToHex(true) // '0x1'
 * boolToHex(false) // '0x0'
 * boolToHex(true, { size: 32 }) // '0x0000...0001' (64 chars)
 * ```
 */
export function boolToHex(value, opts) {
	const hex = value ? '1' : '0'
	if (opts?.size) {
		return /** @type {import('./hex-types.js').Hex} */ (`0x${hex.padStart(opts.size * 2, '0')}`)
	}
	return /** @type {import('./hex-types.js').Hex} */ (`0x${hex}`)
}

/**
 * Convert hex string to boolean.
 * Native implementation that matches viem's hexToBool API.
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must be '0x0', '0x00', '0x1', '0x01', etc.)
 * @returns {boolean} The boolean value
 * @example
 * ```javascript
 * import { hexToBool } from '@tevm/utils'
 * hexToBool('0x1') // true
 * hexToBool('0x0') // false
 * hexToBool('0x01') // true
 * hexToBool('0x00') // false
 * ```
 */
export function hexToBool(hex) {
	if (typeof hex !== 'string' || !hex.startsWith('0x')) {
		throw new Error(`Invalid hex value: ${hex}`)
	}
	const value = hexToBigInt(hex)
	return value !== 0n
}

/**
 * Convert boolean to bytes.
 * Native implementation that matches viem's boolToBytes API.
 * @param {boolean} value - The boolean value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding
 * @returns {Uint8Array} The byte array (Uint8Array([1]) for true, Uint8Array([0]) for false)
 * @example
 * ```javascript
 * import { boolToBytes } from '@tevm/utils'
 * boolToBytes(true) // Uint8Array([1])
 * boolToBytes(false) // Uint8Array([0])
 * boolToBytes(true, { size: 4 }) // Uint8Array([0, 0, 0, 1])
 * ```
 */
export function boolToBytes(value, opts) {
	const size = opts?.size ?? 1
	const bytes = new Uint8Array(size)
	if (value) {
		bytes[size - 1] = 1
	}
	return bytes
}

/**
 * Convert bytes to boolean.
 * Native implementation that matches viem's bytesToBool API.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {boolean} The boolean value (true if any byte is non-zero, false otherwise)
 * @example
 * ```javascript
 * import { bytesToBool } from '@tevm/utils'
 * bytesToBool(new Uint8Array([1])) // true
 * bytesToBool(new Uint8Array([0])) // false
 * bytesToBool(new Uint8Array([0, 0, 0, 1])) // true
 * ```
 */
export function bytesToBool(bytes) {
	for (let i = 0; i < bytes.length; i++) {
		if (bytes[i] !== 0) {
			return true
		}
	}
	return false
}

/**
 * Regex pattern for validating hex strings.
 * Matches '0x' followed by zero or more hex digits (0-9, a-f, A-F).
 * @type {RegExp}
 */
const hexPattern = /^0x[0-9a-fA-F]*$/

/**
 * Check if a value is a valid hex string.
 * Native implementation that matches viem's isHex API.
 * @param {unknown} value - The value to check
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.strict=true] - If true, validates hex characters. If false, only checks for '0x' prefix.
 * @returns {value is import('./hex-types.js').Hex} True if the value is a valid hex string
 * @example
 * ```javascript
 * import { isHex } from '@tevm/utils'
 * isHex('0x1234') // true
 * isHex('0xgg') // false (invalid hex characters)
 * isHex('hello') // false (no 0x prefix)
 * isHex('0xgg', { strict: false }) // true (only checks prefix)
 * ```
 */
export function isHex(value, { strict = true } = {}) {
	if (!value) {
		return false
	}
	if (typeof value !== 'string') {
		return false
	}
	return strict ? hexPattern.test(value) : value.startsWith('0x')
}

/**
 * Check if a value is a valid bytes array (Uint8Array).
 * Native implementation that matches viem's isBytes API.
 * Uses defensive checks for cross-realm compatibility (objects from iframes, etc.).
 * @param {unknown} value - The value to check
 * @returns {value is Uint8Array} True if the value is a Uint8Array
 * @example
 * ```javascript
 * import { isBytes } from '@tevm/utils'
 * isBytes(new Uint8Array([1, 2, 3])) // true
 * isBytes([1, 2, 3]) // false (regular array)
 * isBytes('0x1234') // false (hex string)
 * isBytes(null) // false
 * ```
 */
export function isBytes(value) {
	if (!value) {
		return false
	}
	if (typeof value !== 'object') {
		return false
	}
	if (!('BYTES_PER_ELEMENT' in value)) {
		return false
	}
	return /** @type {any} */ (value).BYTES_PER_ELEMENT === 1 && /** @type {any} */ (value).constructor.name === 'Uint8Array'
}

/**
 * Convert a string to hex encoding.
 * Native implementation that matches viem's stringToHex API.
 * Uses TextEncoder for UTF-8 encoding.
 * @param {string} value - The string to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding (pads with null bytes on the right)
 * @returns {import('./hex-types.js').Hex} The hex string (e.g., '0x68656c6c6f' for 'hello')
 * @example
 * ```javascript
 * import { stringToHex } from '@tevm/utils'
 * stringToHex('hello') // '0x68656c6c6f'
 * stringToHex('') // '0x'
 * stringToHex('hello', { size: 8 }) // '0x68656c6c6f000000' (padded to 8 bytes)
 * ```
 */
export function stringToHex(value, opts) {
	const encoder = new TextEncoder()
	const bytes = encoder.encode(value)

	// If size is specified, we need to handle padding
	if (opts?.size) {
		if (bytes.length > opts.size) {
			throw new Error(`String "${value}" (${bytes.length} bytes) exceeds ${opts.size} byte size`)
		}
		// Create padded array
		const paddedBytes = new Uint8Array(opts.size)
		paddedBytes.set(bytes)
		return bytesToHex(paddedBytes)
	}

	return bytesToHex(bytes)
}

/**
 * Convert a hex string to a UTF-8 string.
 * Native implementation that matches viem's hexToString API.
 * Uses TextDecoder for UTF-8 decoding.
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must start with '0x')
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Expected size in bytes (not currently used, included for API compatibility)
 * @returns {string} The decoded string (e.g., 'hello' from '0x68656c6c6f')
 * @example
 * ```javascript
 * import { hexToString } from '@tevm/utils'
 * hexToString('0x68656c6c6f') // 'hello'
 * hexToString('0x') // ''
 * hexToString('0xf09f988a') // '😊'
 * ```
 */
export function hexToString(hex, _opts = undefined) {
	const bytes = hexToBytes(hex)
	const decoder = new TextDecoder('utf-8')
	return decoder.decode(bytes)
}

/**
 * Convert a UTF-8 string to bytes (Uint8Array).
 * Native implementation that matches viem's stringToBytes API.
 * @param {string} value - The string to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding
 * @returns {Uint8Array} The byte array
 * @example
 * ```javascript
 * import { stringToBytes } from '@tevm/utils'
 * stringToBytes('hello') // Uint8Array([104, 101, 108, 108, 111])
 * stringToBytes('') // Uint8Array([])
 * stringToBytes('hello', { size: 8 }) // Uint8Array([104, 101, 108, 108, 111, 0, 0, 0])
 * ```
 */
export function stringToBytes(value, opts) {
	const encoder = new TextEncoder()
	const bytes = encoder.encode(value)
	if (opts?.size) {
		if (bytes.length > opts.size) {
			throw new Error(`String "${value}" (${bytes.length} bytes) exceeds ${opts.size} byte size`)
		}
		const paddedBytes = new Uint8Array(opts.size)
		paddedBytes.set(bytes)
		return paddedBytes
	}
	return bytes
}

/**
 * Convert bytes to a number.
 * Native implementation that matches viem's bytesToNumber API.
 * @param {Uint8Array} bytes - The bytes to convert
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to treat as signed integer (two's complement)
 * @param {number} [opts.size] - Expected size in bytes (for validation/padding)
 * @returns {number} The number value
 * @throws {Error} If the value exceeds safe integer range
 * @example
 * ```javascript
 * import { bytesToNumber } from '@tevm/utils'
 * bytesToNumber(new Uint8Array([1, 164])) // 420
 * bytesToNumber(new Uint8Array([0xff]), { signed: true }) // -1
 * ```
 */
export function bytesToNumber(bytes, opts) {
	// Use bytesToHex then hexToNumber for consistency
	const hex = bytesToHex(bytes)
	return hexToNumber(hex, opts)
}

/**
 * Convert a number to bytes (Uint8Array).
 * Native implementation that matches viem's numberToBytes API.
 * @param {number | bigint} value - The number or bigint to convert
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to encode as signed integer (two's complement)
 * @param {number} [opts.size] - Size in bytes for padding/signed encoding
 * @returns {Uint8Array} The byte array
 * @example
 * ```javascript
 * import { numberToBytes } from '@tevm/utils'
 * numberToBytes(420) // Uint8Array([1, 164])
 * numberToBytes(0) // Uint8Array([0])
 * numberToBytes(420, { size: 4 }) // Uint8Array([0, 0, 1, 164])
 * numberToBytes(-1, { signed: true, size: 1 }) // Uint8Array([255])
 * ```
 */
export function numberToBytes(value, opts) {
	// Convert number to hex first, then hex to bytes
	const hex = numberToHex(value, opts)
	return hexToBytes(hex)
}

/**
 * Convert bytes to BigInt.
 * Native implementation that matches viem's bytesToBigInt API.
 * @param {Uint8Array} bytes - The bytes to convert
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to treat as signed integer (two's complement)
 * @param {number} [opts.size] - Expected size in bytes (for validation/padding)
 * @returns {bigint} The BigInt value
 * @example
 * ```javascript
 * import { bytesToBigInt } from '@tevm/utils'
 * bytesToBigInt(new Uint8Array([1, 164])) // 420n
 * bytesToBigInt(new Uint8Array([0xff]), { signed: true }) // -1n
 * ```
 */
export function bytesToBigInt(bytes, opts) {
	// Use bytesToHex then hexToBigInt for consistency
	const hex = bytesToHex(bytes)
	return hexToBigInt(hex, opts)
}

/**
 * Alias for bytesToBigInt (viem exports both).
 * @param {Uint8Array} bytes - The bytes to convert
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.signed] - Whether to treat as signed integer (two's complement)
 * @param {number} [opts.size] - Expected size in bytes (for validation/padding)
 * @returns {bigint} The BigInt value
 */
export const bytesToBigint = bytesToBigInt

/**
 * Regex pattern for validating Ethereum addresses.
 * Matches '0x' followed by exactly 40 hex digits (case-insensitive).
 * @type {RegExp}
 */
const addressPattern = /^0x[0-9a-fA-F]{40}$/

/**
 * Check if a value is a valid Ethereum address.
 * Native implementation that matches viem's isAddress API.
 * Validates that the value is a 40-character hex string prefixed with '0x'.
 * Does NOT validate checksum - any valid hex address is accepted.
 * @param {unknown} address - The value to check
 * @param {Object} [opts] - Options (included for API compatibility)
 * @param {boolean} [opts.strict] - Not used in this implementation (checksum validation not implemented)
 * @returns {address is import('./address-types.js').Address} True if the value is a valid Ethereum address
 * @example
 * ```javascript
 * import { isAddress } from '@tevm/utils'
 * isAddress('0x1234567890123456789012345678901234567890') // true
 * isAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045') // true (vitalik.eth)
 * isAddress('0x123') // false (too short)
 * isAddress('hello') // false (no 0x prefix)
 * isAddress(null) // false
 * ```
 */
export function isAddress(address, _opts = undefined) {
	if (!address) {
		return false
	}
	if (typeof address !== 'string') {
		return false
	}
	return addressPattern.test(address)
}

/**
 * Number of decimals for ether (10^18).
 * @type {bigint}
 */
const WEI_PER_ETHER = 1000000000000000000n

/**
 * Format wei value as ether string.
 * Native implementation that matches viem's formatEther API.
 * @param {bigint | number} wei - The wei value to format
 * @returns {string} The formatted ether value (e.g., '1.5' for 1.5 ETH)
 * @example
 * ```javascript
 * import { formatEther } from '@tevm/utils'
 * formatEther(1000000000000000000n) // '1'
 * formatEther(1500000000000000000n) // '1.5'
 * formatEther(100000000000000000n) // '0.1'
 * formatEther(1n) // '0.000000000000000001'
 * ```
 */
export function formatEther(wei) {
	const value = typeof wei === 'bigint' ? wei : BigInt(wei)
	const isNegative = value < 0n
	const absValue = isNegative ? -value : value

	const integerPart = absValue / WEI_PER_ETHER
	const remainder = absValue % WEI_PER_ETHER

	if (remainder === 0n) {
		return isNegative ? `-${integerPart.toString()}` : integerPart.toString()
	}

	// Format fractional part with 18 decimals, then trim trailing zeros
	const fractionalStr = remainder.toString().padStart(18, '0').replace(/0+$/, '')
	const result = `${integerPart}.${fractionalStr}`
	return isNegative ? `-${result}` : result
}

/**
 * Parse ether string to wei value.
 * Native implementation that matches viem's parseEther API.
 * @param {string} ether - The ether value to parse (e.g., '1.5')
 * @returns {bigint} The wei value (e.g., 1500000000000000000n)
 * @example
 * ```javascript
 * import { parseEther } from '@tevm/utils'
 * parseEther('1') // 1000000000000000000n
 * parseEther('0.1') // 100000000000000000n
 * parseEther('1.5') // 1500000000000000000n
 * parseEther('-1') // -1000000000000000000n
 * ```
 */
export function parseEther(ether) {
	// Handle negative values
	const isNegative = ether.startsWith('-')
	const absEther = isNegative ? ether.slice(1) : ether

	// Split into integer and fractional parts
	const parts = absEther.split('.')

	if (parts.length > 2) {
		throw new Error(`Invalid ether value: ${ether}`)
	}

	const integerPart = parts[0] || '0'
	let fractionalPart = parts[1] || ''

	// Truncate or pad fractional part to 18 decimals
	if (fractionalPart.length > 18) {
		// Truncate (viem rounds toward zero)
		fractionalPart = fractionalPart.slice(0, 18)
	} else {
		fractionalPart = fractionalPart.padEnd(18, '0')
	}

	// Combine: integer * 10^18 + fractional
	const integerWei = BigInt(integerPart) * WEI_PER_ETHER
	const fractionalWei = BigInt(fractionalPart)
	const result = integerWei + fractionalWei

	return isNegative ? -result : result
}

/**
 * Number of wei per gwei (10^9).
 * @type {bigint}
 */
const WEI_PER_GWEI = 1000000000n

/**
 * Format wei value as gwei string.
 * Native implementation that matches viem's formatGwei API.
 * @param {bigint | number} wei - The wei value to format
 * @returns {string} The formatted gwei value (e.g., '1.5' for 1.5 gwei)
 * @example
 * ```javascript
 * import { formatGwei } from '@tevm/utils'
 * formatGwei(1000000000n) // '1'
 * formatGwei(1500000000n) // '1.5'
 * formatGwei(100000000n) // '0.1'
 * formatGwei(1n) // '0.000000001'
 * ```
 */
export function formatGwei(wei) {
	const value = typeof wei === 'bigint' ? wei : BigInt(wei)
	const isNegative = value < 0n
	const absValue = isNegative ? -value : value

	const integerPart = absValue / WEI_PER_GWEI
	const remainder = absValue % WEI_PER_GWEI

	if (remainder === 0n) {
		return isNegative ? `-${integerPart.toString()}` : integerPart.toString()
	}

	// Format fractional part with 9 decimals, then trim trailing zeros
	const fractionalStr = remainder.toString().padStart(9, '0').replace(/0+$/, '')
	const result = `${integerPart}.${fractionalStr}`
	return isNegative ? `-${result}` : result
}

/**
 * Parse gwei string to wei value.
 * Native implementation that matches viem's parseGwei API.
 * @param {string} gwei - The gwei value to parse (e.g., '1.5')
 * @returns {bigint} The wei value (e.g., 1500000000n)
 * @example
 * ```javascript
 * import { parseGwei } from '@tevm/utils'
 * parseGwei('1') // 1000000000n
 * parseGwei('0.1') // 100000000n
 * parseGwei('1.5') // 1500000000n
 * parseGwei('-1') // -1000000000n
 * ```
 */
export function parseGwei(gwei) {
	// Handle negative values
	const isNegative = gwei.startsWith('-')
	const absGwei = isNegative ? gwei.slice(1) : gwei

	// Split into integer and fractional parts
	const parts = absGwei.split('.')

	if (parts.length > 2) {
		throw new Error(`Invalid gwei value: ${gwei}`)
	}

	const integerPart = parts[0] || '0'
	let fractionalPart = parts[1] || ''

	// Truncate or pad fractional part to 9 decimals
	if (fractionalPart.length > 9) {
		// Truncate (viem rounds toward zero)
		fractionalPart = fractionalPart.slice(0, 9)
	} else {
		fractionalPart = fractionalPart.padEnd(9, '0')
	}

	// Combine: integer * 10^9 + fractional
	const integerWei = BigInt(integerPart) * WEI_PER_GWEI
	const fractionalWei = BigInt(fractionalPart)
	const result = integerWei + fractionalWei

	return isNegative ? -result : result
}

/**
 * Parse a string value with the given number of decimals into a bigint.
 * Native implementation that matches viem's parseUnits API.
 * @param {string} value - The value to parse (e.g., '1.5')
 * @param {number} decimals - The number of decimals (e.g., 18 for ether, 6 for USDC)
 * @returns {bigint} The parsed value as bigint (e.g., 1500000n for parseUnits('1.5', 6))
 * @example
 * ```javascript
 * import { parseUnits } from '@tevm/utils'
 * parseUnits('1', 18) // 1000000000000000000n (1 ether)
 * parseUnits('1.5', 6) // 1500000n (1.5 USDC)
 * parseUnits('0.1', 18) // 100000000000000000n
 * parseUnits('100', 6) // 100000000n
 * parseUnits('-1', 18) // -1000000000000000000n
 * ```
 */
export function parseUnits(value, decimals) {
	// Handle negative values
	const isNegative = value.startsWith('-')
	const absValue = isNegative ? value.slice(1) : value

	// Split into integer and fractional parts
	const parts = absValue.split('.')

	if (parts.length > 2) {
		throw new Error(`Invalid value: ${value}`)
	}

	const integerPart = parts[0] || '0'
	let fractionalPart = parts[1] || ''

	// Truncate or pad fractional part to specified decimals
	if (fractionalPart.length > decimals) {
		// Truncate (viem rounds toward zero)
		fractionalPart = fractionalPart.slice(0, decimals)
	} else {
		fractionalPart = fractionalPart.padEnd(decimals, '0')
	}

	// Calculate multiplier: 10^decimals
	const multiplier = 10n ** BigInt(decimals)

	// Combine: integer * multiplier + fractional
	const integerAmount = BigInt(integerPart) * multiplier
	const fractionalAmount = fractionalPart.length > 0 ? BigInt(fractionalPart) : 0n
	const result = integerAmount + fractionalAmount

	return isNegative ? -result : result
}

/**
 * Compute Keccak-256 hash.
 * Native implementation that matches viem's keccak256 API.
 * Uses @noble/hashes for the underlying implementation (same as voltaire).
 * @param {Uint8Array | import('./hex-types.js').Hex} value - The value to hash (bytes or hex string)
 * @param {'bytes' | 'hex'} [to='hex'] - Output format: 'hex' returns Hex string, 'bytes' returns Uint8Array
 * @returns {import('./hex-types.js').Hex} The Keccak-256 hash (returns Hex by default, Uint8Array if to='bytes')
 * @example
 * ```javascript
 * import { keccak256 } from '@tevm/utils'
 * // Hash bytes
 * keccak256(new Uint8Array([1, 2, 3])) // '0x...' (64 hex chars)
 * // Hash hex string
 * keccak256('0x010203') // '0x...' (64 hex chars)
 * // Get bytes output
 * keccak256('0x010203', 'bytes') // Uint8Array(32)
 * ```
 */
export function keccak256(value, to = 'hex') {
	// Convert hex string to bytes if needed
	const bytes = typeof value === 'string' ? hexToBytes(value) : value
	// Hash using @tevm/voltaire
	const hash = keccak256Hash(bytes)
	// Return in requested format
	return /** @type {import('./hex-types.js').Hex} */ (to === 'bytes' ? hash : bytesToHex(hash))
}

/**
 * Convert an Ethereum address to its checksummed version (EIP-55).
 * Native implementation that matches viem's getAddress API.
 * Uses keccak256 to compute the checksum based on the address characters.
 * @param {string} address - The address to checksum (must be a valid 40-char hex address)
 * @returns {import('./address-types.js').Address} The checksummed address
 * @throws {Error} If the address is invalid
 * @example
 * ```javascript
 * import { getAddress } from '@tevm/utils'
 * // Convert any address to checksummed format
 * getAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
 * // '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
 *
 * // Already checksummed addresses pass through
 * getAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
 * // '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
 *
 * // Uppercase addresses get proper checksum
 * getAddress('0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045')
 * // '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
 * ```
 */
export function getAddress(address) {
	// Validate the address format
	if (!isAddress(address)) {
		throw new Error(`Invalid address: ${address}`)
	}

	// Get the lowercase address without 0x prefix
	const lowercaseAddress = address.slice(2).toLowerCase()

	// Hash the lowercase address (as UTF-8 bytes, not hex)
	// keccak256 with default 'hex' output returns string starting with '0x'
	const hashHex = /** @type {string} */ (keccak256(stringToHex(lowercaseAddress))).slice(2)

	// Build checksummed address using EIP-55 algorithm
	let checksummed = '0x'
	for (let i = 0; i < 40; i++) {
		const char = /** @type {string} */ (lowercaseAddress[i])
		// If the character is a letter (a-f) and the corresponding nibble in hash >= 8, uppercase it
		const hashNibble = parseInt(/** @type {string} */ (hashHex[i]), 16)
		if (char >= 'a' && char <= 'f' && hashNibble >= 8) {
			checksummed += char.toUpperCase()
		} else {
			checksummed += char
		}
	}

	return /** @type {import('./address-types.js').Address} */ (checksummed)
}

/**
 * Polymorphic function to convert various types to hex string.
 * Native implementation that matches viem's toHex API.
 * @param {string | number | bigint | boolean | Uint8Array} value - The value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding
 * @returns {import('./hex-types.js').Hex} The hex string (e.g., '0x1234')
 * @example
 * ```javascript
 * import { toHex } from '@tevm/utils'
 * // Convert bytes
 * toHex(new Uint8Array([1, 164])) // '0x01a4'
 * // Convert number/bigint
 * toHex(420n) // '0x1a4'
 * toHex(420) // '0x1a4'
 * // Convert boolean
 * toHex(true) // '0x1'
 * // Convert string (UTF-8 encode)
 * toHex('hello') // '0x68656c6c6f'
 * // With size padding
 * toHex(420n, { size: 4 }) // '0x000001a4'
 * ```
 */
export function toHex(value, opts) {
	// Handle Uint8Array
	if (value instanceof Uint8Array) {
		if (opts?.size) {
			// Pad to specified size
			if (value.length > opts.size) {
				throw new Error(`Bytes value of length ${value.length} exceeds ${opts.size} byte size`)
			}
			const paddedBytes = new Uint8Array(opts.size)
			paddedBytes.set(value, opts.size - value.length)
			return bytesToHex(paddedBytes)
		}
		return bytesToHex(value)
	}

	// Handle boolean
	if (typeof value === 'boolean') {
		return boolToHex(value, opts)
	}

	// Handle number/bigint
	if (typeof value === 'number' || typeof value === 'bigint') {
		return numberToHex(value, opts)
	}

	// Handle string (UTF-8 encode)
	if (typeof value === 'string') {
		return stringToHex(value, opts)
	}

	throw new Error(`Cannot convert value of type ${typeof value} to hex`)
}

/**
 * Polymorphic function to convert hex to various types.
 * Native implementation that matches viem's fromHex API.
 * @template {'string' | 'number' | 'bigint' | 'boolean' | 'bytes'} TTo
 * @param {import('./hex-types.js').Hex} hex - The hex string to convert (must start with '0x')
 * @param {TTo | { to: TTo; size?: number }} toOrOpts - Output type or options with output type
 * @returns {TTo extends 'string' ? string : TTo extends 'number' ? number : TTo extends 'bigint' ? bigint : TTo extends 'boolean' ? boolean : Uint8Array} The converted value
 * @example
 * ```javascript
 * import { fromHex } from '@tevm/utils'
 * // To bytes
 * fromHex('0x01a4', 'bytes') // Uint8Array([1, 164])
 * // To number
 * fromHex('0x1a4', 'number') // 420
 * // To bigint
 * fromHex('0x1a4', 'bigint') // 420n
 * // To boolean
 * fromHex('0x1', 'boolean') // true
 * fromHex('0x0', 'boolean') // false
 * // To string (UTF-8 decode)
 * fromHex('0x68656c6c6f', 'string') // 'hello'
 * // With options object
 * fromHex('0xff', { to: 'number', size: 1 }) // 255
 * ```
 */
export function fromHex(hex, toOrOpts) {
	const to = typeof toOrOpts === 'string' ? toOrOpts : toOrOpts.to
	const optsObj = typeof toOrOpts === 'string' ? undefined : toOrOpts
	// Extract signed option for number/bigint conversions
	const signedOpts = optsObj && 'signed' in optsObj ? { signed: /** @type {any} */ (optsObj).signed } : undefined

	switch (to) {
		case 'bytes':
			return /** @type {any} */ (hexToBytes(hex))
		case 'number':
			return /** @type {any} */ (hexToNumber(hex, signedOpts))
		case 'bigint':
			return /** @type {any} */ (hexToBigInt(hex, signedOpts))
		case 'boolean':
			return /** @type {any} */ (hexToBool(hex))
		case 'string':
			return /** @type {any} */ (hexToString(hex))
		default:
			throw new Error(`Unknown conversion target: ${to}`)
	}
}

/**
 * Polymorphic function to convert various types to bytes (Uint8Array).
 * Native implementation that matches viem's toBytes API.
 * @param {string | number | bigint | boolean | import('./hex-types.js').Hex} value - The value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding
 * @returns {Uint8Array} The byte array
 * @example
 * ```javascript
 * import { toBytes } from '@tevm/utils'
 * // Convert hex string
 * toBytes('0x01a4') // Uint8Array([1, 164])
 * // Convert number/bigint
 * toBytes(420n) // Uint8Array([1, 164])
 * toBytes(420) // Uint8Array([1, 164])
 * // Convert boolean
 * toBytes(true) // Uint8Array([1])
 * // Convert string (UTF-8 encode if not hex)
 * toBytes('hello') // Uint8Array([104, 101, 108, 108, 111])
 * // With size padding
 * toBytes(420n, { size: 4 }) // Uint8Array([0, 0, 1, 164])
 * ```
 */
export function toBytes(value, opts) {
	// Handle boolean
	if (typeof value === 'boolean') {
		return boolToBytes(value, opts)
	}

	// Handle number/bigint
	if (typeof value === 'number' || typeof value === 'bigint') {
		const hex = numberToHex(value, opts)
		return hexToBytes(hex)
	}

	// Handle string (could be hex or UTF-8 string)
	if (typeof value === 'string') {
		// If it starts with 0x, treat as hex
		if (value.startsWith('0x')) {
			const bytes = hexToBytes(/** @type {import('./hex-types.js').Hex} */ (value))
			// Handle size padding for hex input
			if (opts?.size) {
				if (bytes.length > opts.size) {
					throw new Error(`Hex value of length ${bytes.length} exceeds ${opts.size} byte size`)
				}
				const paddedBytes = new Uint8Array(opts.size)
				paddedBytes.set(bytes, opts.size - bytes.length)
				return paddedBytes
			}
			return bytes
		}
		// Otherwise treat as UTF-8 string
		const encoder = new TextEncoder()
		const bytes = encoder.encode(value)
		if (opts?.size) {
			if (bytes.length > opts.size) {
				throw new Error(`String "${value}" (${bytes.length} bytes) exceeds ${opts.size} byte size`)
			}
			// Note: string padding is on the right (null bytes), unlike numbers
			const paddedBytes = new Uint8Array(opts.size)
			paddedBytes.set(bytes)
			return paddedBytes
		}
		return bytes
	}

	throw new Error(`Cannot convert value of type ${typeof value} to bytes`)
}

/**
 * Polymorphic function to convert bytes to various types.
 * Native implementation that matches viem's fromBytes API.
 * @template {'string' | 'number' | 'bigint' | 'boolean' | 'hex'} TTo
 * @param {Uint8Array} bytes - The bytes to convert
 * @param {TTo | { to: TTo; size?: number }} toOrOpts - Output type or options with output type
 * @returns {TTo extends 'string' ? string : TTo extends 'number' ? number : TTo extends 'bigint' ? bigint : TTo extends 'boolean' ? boolean : import('./hex-types.js').Hex} The converted value
 * @example
 * ```javascript
 * import { fromBytes } from '@tevm/utils'
 * // To hex
 * fromBytes(new Uint8Array([1, 164]), 'hex') // '0x01a4'
 * // To number
 * fromBytes(new Uint8Array([1, 164]), 'number') // 420
 * // To bigint
 * fromBytes(new Uint8Array([1, 164]), 'bigint') // 420n
 * // To boolean
 * fromBytes(new Uint8Array([1]), 'boolean') // true
 * fromBytes(new Uint8Array([0]), 'boolean') // false
 * // To string (UTF-8 decode)
 * fromBytes(new Uint8Array([104, 101, 108, 108, 111]), 'string') // 'hello'
 * ```
 */
export function fromBytes(bytes, toOrOpts) {
	const to = typeof toOrOpts === 'string' ? toOrOpts : toOrOpts.to
	const opts = typeof toOrOpts === 'string' ? undefined : toOrOpts

	switch (to) {
		case 'hex':
			return /** @type {any} */ (bytesToHex(bytes))
		case 'number':
			return /** @type {any} */ (bytesToNumber(bytes, opts))
		case 'bigint':
			return /** @type {any} */ (bytesToBigInt(bytes, opts))
		case 'boolean':
			return /** @type {any} */ (bytesToBool(bytes))
		case 'string': {
			const decoder = new TextDecoder('utf-8')
			return /** @type {any} */ (decoder.decode(bytes))
		}
		default:
			throw new Error(`Unknown conversion target: ${to}`)
	}
}

/**
 * Encode a length as RLP length bytes.
 * @param {number} length - The length to encode
 * @param {number} offset - The base offset (0x80 for strings, 0xc0 for lists)
 * @returns {Uint8Array} The RLP length prefix bytes
 */
function encodeLength(length, offset) {
	if (length < 56) {
		return new Uint8Array([offset + length])
	}
	// Encode length as minimal big-endian bytes
	const lengthBytes = []
	let temp = length
	while (temp > 0) {
		lengthBytes.unshift(temp & 0xff)
		temp = Math.floor(temp / 256)
	}
	const lengthOfLength = lengthBytes.length
	const result = new Uint8Array(1 + lengthOfLength)
	result[0] = offset + 55 + lengthOfLength
	for (let i = 0; i < lengthOfLength; i++) {
		result[1 + i] = /** @type {number} */ (lengthBytes[i])
	}
	return result
}

/**
 * RLP encode a single byte array (string in RLP terminology).
 * @param {Uint8Array} bytes - The bytes to encode
 * @returns {Uint8Array} RLP encoded bytes
 */
function rlpEncodeBytes(bytes) {
	// Single byte [0x00, 0x7f] is its own encoding
	if (bytes.length === 1 && bytes[0] !== undefined && bytes[0] < 0x80) {
		return bytes
	}
	// Otherwise prepend length prefix
	const prefix = encodeLength(bytes.length, 0x80)
	const result = new Uint8Array(prefix.length + bytes.length)
	result.set(prefix, 0)
	result.set(bytes, prefix.length)
	return result
}

/**
 * RLP encode a list of items.
 * @param {Array<Uint8Array | Array<any>>} items - The items to encode (already RLP-encoded)
 * @returns {Uint8Array} RLP encoded list
 */
function rlpEncodeList(items) {
	// First, RLP-encode each item and calculate total payload length
	const encodedItems = items.map(item => {
		if (item instanceof Uint8Array) {
			return rlpEncodeBytes(item)
		}
		if (Array.isArray(item)) {
			return rlpEncodeList(item)
		}
		throw new Error(`Cannot RLP encode value of type ${typeof item}`)
	})

	// Calculate total payload length
	let totalLength = 0
	for (const encoded of encodedItems) {
		totalLength += encoded.length
	}

	// Prepend list prefix
	const prefix = encodeLength(totalLength, 0xc0)
	const result = new Uint8Array(prefix.length + totalLength)
	result.set(prefix, 0)

	// Copy all encoded items
	let offset = prefix.length
	for (const encoded of encodedItems) {
		result.set(encoded, offset)
		offset += encoded.length
	}

	return result
}

/**
 * Convert a hex string to bytes for RLP encoding.
 * @param {string} hex - The hex string (with 0x prefix)
 * @returns {Uint8Array} The bytes
 */
function hexToRlpBytes(hex) {
	if (typeof hex !== 'string' || !hex.startsWith('0x')) {
		throw new Error(`Invalid hex value: ${hex}`)
	}
	const hexDigits = hex.slice(2)
	// Handle empty hex '0x' - this should encode as empty bytes
	if (hexDigits.length === 0) {
		return new Uint8Array(0)
	}
	// Pad odd-length hex strings
	const paddedHex = hexDigits.length % 2 === 0 ? hexDigits : `0${hexDigits}`
	const bytes = new Uint8Array(paddedHex.length / 2)
	for (let i = 0; i < paddedHex.length; i += 2) {
		bytes[i / 2] = parseInt(paddedHex.slice(i, i + 2), 16)
	}
	return bytes
}

/**
 * RLP encode a value (polymorphic).
 * Accepts hex strings, byte arrays, or arrays of either.
 * Native implementation that matches viem's toRlp API.
 * @param {import('./hex-types.js').Hex | Uint8Array | Array<import('./hex-types.js').Hex | Uint8Array | Array<any>>} value - The value to encode
 * @param {'hex' | 'bytes'} [to='hex'] - Output format
 * @returns {import('./hex-types.js').Hex | Uint8Array} The RLP encoded value
 * @example
 * ```javascript
 * import { toRlp } from '@tevm/utils'
 * // Encode hex string
 * toRlp('0x123456789') // '0x850123456789'
 * // Encode list
 * toRlp(['0x7f', '0x7f', '0x8081e8']) // '0xc67f7f838081e8'
 * // Encode bytes
 * toRlp(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])) // '0x89010203040506070809'
 * // Get bytes output
 * toRlp('0x123456789', 'bytes') // Uint8Array [133, 1, 35, 69, 103, 137]
 * ```
 */
export function toRlp(value, to = 'hex') {
	/** @type {Uint8Array} */
	let encoded

	if (value instanceof Uint8Array) {
		encoded = rlpEncodeBytes(value)
	} else if (typeof value === 'string') {
		// Hex string
		const bytes = hexToRlpBytes(value)
		encoded = rlpEncodeBytes(bytes)
	} else if (Array.isArray(value)) {
		// List - convert hex strings to bytes first
		const items = value.map(item => {
			if (typeof item === 'string') {
				return hexToRlpBytes(item)
			}
			return item
		})
		encoded = rlpEncodeList(items)
	} else {
		throw new Error(`Cannot RLP encode value of type ${typeof value}`)
	}

	if (to === 'bytes') {
		return encoded
	}

	// Convert to hex
	return bytesToHex(encoded)
}

/**
 * Decode a single RLP item from bytes.
 * @param {Uint8Array} bytes - The RLP-encoded bytes
 * @param {number} offset - Starting offset
 * @returns {{ value: Uint8Array | Array<any>, consumed: number }} Decoded value and bytes consumed
 */
function rlpDecodeItem(bytes, offset) {
	if (offset >= bytes.length) {
		throw new Error('RLP: Input too short')
	}

	const prefix = /** @type {number} */ (bytes[offset])

	// Single byte [0x00, 0x7f]
	if (prefix < 0x80) {
		return { value: bytes.slice(offset, offset + 1), consumed: 1 }
	}

	// Short string [0x80, 0xb7]
	if (prefix <= 0xb7) {
		const length = prefix - 0x80
		if (offset + 1 + length > bytes.length) {
			throw new Error('RLP: Input too short for string')
		}
		return { value: bytes.slice(offset + 1, offset + 1 + length), consumed: 1 + length }
	}

	// Long string [0xb8, 0xbf]
	if (prefix <= 0xbf) {
		const lengthOfLength = prefix - 0xb7
		if (offset + 1 + lengthOfLength > bytes.length) {
			throw new Error('RLP: Input too short for string length')
		}
		let length = 0
		for (let i = 0; i < lengthOfLength; i++) {
			length = length * 256 + /** @type {number} */ (bytes[offset + 1 + i])
		}
		if (offset + 1 + lengthOfLength + length > bytes.length) {
			throw new Error('RLP: Input too short for string')
		}
		return {
			value: bytes.slice(offset + 1 + lengthOfLength, offset + 1 + lengthOfLength + length),
			consumed: 1 + lengthOfLength + length
		}
	}

	// Short list [0xc0, 0xf7]
	if (prefix <= 0xf7) {
		const length = prefix - 0xc0
		if (offset + 1 + length > bytes.length) {
			throw new Error('RLP: Input too short for list')
		}
		const items = []
		let itemOffset = offset + 1
		const endOffset = offset + 1 + length
		while (itemOffset < endOffset) {
			const result = rlpDecodeItem(bytes, itemOffset)
			items.push(result.value)
			itemOffset += result.consumed
		}
		return { value: items, consumed: 1 + length }
	}

	// Long list [0xf8, 0xff]
	const lengthOfLength = prefix - 0xf7
	if (offset + 1 + lengthOfLength > bytes.length) {
		throw new Error('RLP: Input too short for list length')
	}
	let length = 0
	for (let i = 0; i < lengthOfLength; i++) {
		length = length * 256 + /** @type {number} */ (bytes[offset + 1 + i])
	}
	if (offset + 1 + lengthOfLength + length > bytes.length) {
		throw new Error('RLP: Input too short for list')
	}
	const items = []
	let itemOffset = offset + 1 + lengthOfLength
	const endOffset = offset + 1 + lengthOfLength + length
	while (itemOffset < endOffset) {
		const result = rlpDecodeItem(bytes, itemOffset)
		items.push(result.value)
		itemOffset += result.consumed
	}
	return { value: items, consumed: 1 + lengthOfLength + length }
}

/**
 * Convert decoded RLP value to hex format.
 * @param {Uint8Array | Array<any>} value - The decoded value
 * @returns {import('./hex-types.js').Hex | Array<any>} The hex-formatted value
 */
function toHexOutput(value) {
	if (value instanceof Uint8Array) {
		return bytesToHex(value)
	}
	if (Array.isArray(value)) {
		return value.map(item => toHexOutput(item))
	}
	return value
}

/**
 * RLP decode a value.
 * Native implementation that matches viem's fromRlp API.
 * @template {'hex' | 'bytes'} TTo
 * @param {import('./hex-types.js').Hex | Uint8Array} value - The RLP-encoded value
 * @param {TTo} [to='hex'] - Output format
 * @returns {TTo extends 'bytes' ? Uint8Array | Array<any> : import('./hex-types.js').Hex | Array<any>} The decoded value
 * @example
 * ```javascript
 * import { fromRlp } from '@tevm/utils'
 * // Decode hex string
 * fromRlp('0x850123456789', 'hex') // '0x123456789'
 * // Decode list
 * fromRlp('0xc67f7f838081e8', 'hex') // ['0x7f', '0x7f', '0x8081e8']
 * // Get bytes output
 * fromRlp('0x89010203040506070809', 'bytes') // Uint8Array [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 */
export function fromRlp(value, to = /** @type {TTo} */ ('hex')) {
	// Convert hex to bytes if needed
	const bytes = typeof value === 'string' ? hexToRlpBytes(value) : value

	if (bytes.length === 0) {
		throw new Error('RLP: Cannot decode empty input')
	}

	const result = rlpDecodeItem(bytes, 0)

	// Verify all bytes were consumed
	if (result.consumed !== bytes.length) {
		throw new Error(`RLP: Extra data after decoded value`)
	}

	if (to === 'bytes') {
		return /** @type {any} */ (result.value)
	}

	// Convert to hex output
	return /** @type {any} */ (toHexOutput(result.value))
}

/**
 * @typedef {Object} RpcLog
 * @property {string} [address] - Contract address
 * @property {string} [blockHash] - Block hash
 * @property {string} [blockNumber] - Block number as hex
 * @property {string} [data] - Log data
 * @property {string} [logIndex] - Log index as hex
 * @property {string} [transactionHash] - Transaction hash
 * @property {string} [transactionIndex] - Transaction index as hex
 * @property {string[]} [topics] - Log topics
 * @property {boolean} [removed] - Whether log was removed
 */

/**
 * @typedef {Object} Log
 * @property {string} [address] - Contract address
 * @property {string | null} blockHash - Block hash or null if pending
 * @property {bigint | null} blockNumber - Block number or null if pending
 * @property {string} [data] - Log data
 * @property {number | null} logIndex - Log index or null if pending
 * @property {string | null} transactionHash - Transaction hash or null if pending
 * @property {number | null} transactionIndex - Transaction index or null if pending
 * @property {string[]} [topics] - Log topics
 * @property {boolean} [removed] - Whether log was removed
 * @property {unknown} [args] - Decoded event args (when eventName is provided)
 * @property {string} [eventName] - Event name (when provided)
 */

/**
 * Format a raw RPC log object into a structured Log object.
 * Native implementation that matches viem's formatLog API.
 * Converts hex string numbers to native JavaScript types (bigint, number).
 * @param {Partial<RpcLog>} log - The raw RPC log object
 * @param {Object} [opts] - Options
 * @param {unknown} [opts.args] - Decoded event arguments
 * @param {string} [opts.eventName] - Event name for the log
 * @returns {Log} The formatted log object
 * @example
 * ```javascript
 * import { formatLog } from '@tevm/utils'
 * const rpcLog = {
 *   address: '0x...',
 *   blockHash: '0x...',
 *   blockNumber: '0x1a4',
 *   logIndex: '0x0',
 *   transactionHash: '0x...',
 *   transactionIndex: '0x1',
 *   topics: ['0x...'],
 *   data: '0x...'
 * }
 * const log = formatLog(rpcLog)
 * // { address: '0x...', blockHash: '0x...', blockNumber: 420n, logIndex: 0, ... }
 * ```
 */
export function formatLog(log, { args, eventName } = {}) {
	return /** @type {Log} */ ({
		...log,
		blockHash: log.blockHash ? log.blockHash : null,
		blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
		logIndex: log.logIndex ? Number(log.logIndex) : null,
		transactionHash: log.transactionHash ? log.transactionHash : null,
		transactionIndex: log.transactionIndex
			? Number(log.transactionIndex)
			: null,
		...(eventName ? { args, eventName } : {}),
	})
}

/**
 * Extract the canonical function signature from a string.
 * Removes 'function ' or 'event ' prefix if present.
 * @param {string} signature - The function/event signature (e.g., 'function transfer(address,uint256)' or 'transfer(address,uint256)')
 * @returns {string} The canonical signature (e.g., 'transfer(address,uint256)')
 */
function normalizeSignature(signature) {
	// Remove 'function ' prefix if present
	if (signature.startsWith('function ')) {
		return signature.slice(9).replace(/\s+/g, '')
	}
	// Remove 'event ' prefix if present
	if (signature.startsWith('event ')) {
		return signature.slice(6).replace(/\s+/g, '')
	}
	// Remove any whitespace
	return signature.replace(/\s+/g, '')
}

/**
 * Get the 4-byte function selector for a function signature.
 * Native implementation that matches viem's toFunctionSelector API.
 * The selector is the first 4 bytes of the keccak256 hash of the function signature.
 * @param {string} signature - The function signature (e.g., 'transfer(address,uint256)' or 'function transfer(address,uint256)')
 * @returns {import('./hex-types.js').Hex} The 4-byte function selector (e.g., '0xa9059cbb')
 * @example
 * ```javascript
 * import { toFunctionSelector } from '@tevm/utils'
 * // Standard function signature
 * toFunctionSelector('transfer(address,uint256)') // '0xa9059cbb'
 * // With 'function' prefix (also supported)
 * toFunctionSelector('function transfer(address,uint256)') // '0xa9059cbb'
 * // Error selectors
 * toFunctionSelector('Error(string)') // '0x08c379a0'
 * toFunctionSelector('Panic(uint256)') // '0x4e487b71'
 * ```
 */
export function toFunctionSelector(signature) {
	const normalizedSig = normalizeSignature(signature)
	const hash = keccak256(stringToHex(normalizedSig))
	// Return first 4 bytes (8 hex chars + '0x' prefix = 10 chars)
	return /** @type {import('./hex-types.js').Hex} */ (hash.slice(0, 10))
}

/**
 * Get the 32-byte event selector (topic0) for an event signature.
 * Native implementation that matches viem's toEventSelector API.
 * The selector is the full keccak256 hash of the event signature.
 * @param {string} signature - The event signature (e.g., 'Transfer(address,address,uint256)' or 'event Transfer(address,address,uint256)')
 * @returns {import('./hex-types.js').Hex} The 32-byte event selector (topic0)
 * @example
 * ```javascript
 * import { toEventSelector } from '@tevm/utils'
 * // Standard event signature
 * toEventSelector('Transfer(address,address,uint256)')
 * // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
 * // With 'event' prefix (also supported)
 * toEventSelector('event Transfer(address,address,uint256)')
 * // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
 * ```
 */
export function toEventSelector(signature) {
	const normalizedSig = normalizeSignature(signature)
	return keccak256(stringToHex(normalizedSig))
}

/**
 * Concatenate multiple hex strings into a single hex string.
 * Native implementation that matches viem's concatHex API.
 * @param {readonly import('./hex-types.js').Hex[]} hexValues - Array of hex strings to concatenate
 * @returns {import('./hex-types.js').Hex} The concatenated hex string
 * @example
 * ```javascript
 * import { concatHex } from '@tevm/utils'
 * concatHex(['0x12', '0x34', '0x56']) // '0x123456'
 * concatHex(['0xdead', '0xbeef']) // '0xdeadbeef'
 * concatHex(['0x']) // '0x'
 * ```
 */
export function concatHex(hexValues) {
	// Convert each hex string to bytes, concatenate, then convert back to hex
	/** @type {number[]} */
	const allBytes = []
	for (const hex of hexValues) {
		const bytes = hexToBytes(hex)
		for (let i = 0; i < bytes.length; i++) {
			allBytes.push(/** @type {number} */ (bytes[i]))
		}
	}
	return bytesToHex(new Uint8Array(allBytes))
}

/**
 * Encode a value for packed ABI encoding.
 * @param {string} type - The solidity type
 * @param {unknown} value - The value to encode
 * @returns {Uint8Array} The packed encoded bytes
 */
function encodePackedValue(type, value) {
	// Handle arrays first (before checking for uint/int which might match array element types)
	if (type.endsWith('[]')) {
		const elementType = type.slice(0, -2)
		const array = /** @type {unknown[]} */ (value)
		const parts = []
		for (const item of array) {
			parts.push(encodePackedValue(elementType, item))
		}
		const totalLength = parts.reduce((sum, part) => sum + part.length, 0)
		const result = new Uint8Array(totalLength)
		let offset = 0
		for (const part of parts) {
			result.set(part, offset)
			offset += part.length
		}
		return result
	}

	// Fixed arrays
	const fixedArrayMatch = type.match(/^(.+)\[(\d+)\]$/)
	if (fixedArrayMatch?.[1] && fixedArrayMatch[2]) {
		const elementType = fixedArrayMatch[1]
		const length = parseInt(fixedArrayMatch[2])
		const array = /** @type {unknown[]} */ (value)
		if (array.length !== length) {
			throw new Error(`Invalid ${type} length: expected ${length}, got ${array.length}`)
		}
		const parts = []
		for (const item of array) {
			parts.push(encodePackedValue(elementType, item))
		}
		const totalLength = parts.reduce((sum, part) => sum + part.length, 0)
		const result = new Uint8Array(totalLength)
		let offset = 0
		for (const part of parts) {
			result.set(part, offset)
			offset += part.length
		}
		return result
	}

	// Address - 20 bytes
	if (type === 'address') {
		const addr = /** @type {string} */ (value)
		return hexToBytes(/** @type {import('./hex-types.js').Hex} */ (addr))
	}

	// Bool - 1 byte
	if (type === 'bool') {
		return new Uint8Array([value ? 1 : 0])
	}

	// String - UTF-8 bytes, no length prefix
	if (type === 'string') {
		return new TextEncoder().encode(/** @type {string} */ (value))
	}

	// Dynamic bytes - raw bytes, no length prefix
	if (type === 'bytes') {
		if (typeof value === 'string') {
			return hexToBytes(/** @type {import('./hex-types.js').Hex} */ (value))
		}
		return /** @type {Uint8Array} */ (value)
	}

	// Fixed bytes (bytes1-bytes32)
	if (type.startsWith('bytes') && type.length > 5) {
		const size = parseInt(type.slice(5))
		if (size >= 1 && size <= 32) {
			const bytes = typeof value === 'string'
				? hexToBytes(/** @type {import('./hex-types.js').Hex} */ (value))
				: /** @type {Uint8Array} */ (value)
			if (bytes.length !== size) {
				throw new Error(`Invalid ${type} length: expected ${size}, got ${bytes.length}`)
			}
			return bytes
		}
	}

	// Uint types
	if (type.startsWith('uint')) {
		const bits = type === 'uint' ? 256 : parseInt(type.slice(4))
		const bytes = bits / 8
		const bigintValue = typeof value === 'number' ? BigInt(value) : /** @type {bigint} */ (value)
		const result = new Uint8Array(bytes)
		let v = bigintValue
		for (let i = bytes - 1; i >= 0; i--) {
			result[i] = Number(v & 0xffn)
			v >>= 8n
		}
		return result
	}

	// Int types (two's complement)
	if (type.startsWith('int')) {
		const bits = type === 'int' ? 256 : parseInt(type.slice(3))
		const bytes = bits / 8
		const bigintValue = typeof value === 'number' ? BigInt(value) : /** @type {bigint} */ (value)
		// Convert to two's complement if negative
		const unsigned = bigintValue < 0n ? (1n << BigInt(bits)) + bigintValue : bigintValue
		const result = new Uint8Array(bytes)
		let v = unsigned
		for (let i = bytes - 1; i >= 0; i--) {
			result[i] = Number(v & 0xffn)
			v >>= 8n
		}
		return result
	}

	throw new Error(`Unsupported packed type: ${type}`)
}

/**
 * ABI encodePacked - compact encoding without padding.
 * Native implementation that matches viem's encodePacked API.
 * Used for hash computations where standard ABI encoding would waste space.
 * @param {readonly string[]} types - Array of Solidity type strings
 * @param {readonly unknown[]} values - Array of values to encode
 * @returns {import('./hex-types.js').Hex} The packed encoded data as a hex string
 * @example
 * ```javascript
 * import { encodePacked } from '@tevm/utils'
 * // Encode address and uint256 (common for creating signatures)
 * encodePacked(['address', 'uint256'], ['0x742d35cc6634c0532925a3b844bc9e7595f251e3', 100n])
 * // => '0x742d35cc6634c0532925a3b844bc9e7595f251e30000000000000000000000000000000000000000000000000000000000000064'
 *
 * // Encode for EIP-191 signing
 * encodePacked(['string', 'bytes32'], ['hello', '0x1234...'])
 *
 * // Encode multiple types
 * encodePacked(['uint8', 'uint16', 'uint32'], [1, 256, 65536])
 * ```
 */
export function encodePacked(types, values) {
	if (types.length !== values.length) {
		throw new Error(`Type/value count mismatch: ${types.length} types, ${values.length} values`)
	}

	const parts = []
	for (let i = 0; i < types.length; i++) {
		const type = types[i]
		const value = values[i]
		if (!type) continue
		parts.push(encodePackedValue(type, value))
	}

	// Concatenate all parts
	const totalLength = parts.reduce((sum, part) => sum + part.length, 0)
	const result = new Uint8Array(totalLength)
	let offset = 0
	for (const part of parts) {
		result.set(part, offset)
		offset += part.length
	}

	return bytesToHex(result)
}

/**
 * @typedef {Object} TransactionSerializableBase
 * @property {number} [chainId] - Chain ID
 * @property {bigint | number} [nonce] - Transaction nonce
 * @property {bigint | number} [gas] - Gas limit
 * @property {import('./address-types.js').Address} [to] - Recipient address
 * @property {bigint | number} [value] - Value in wei
 * @property {import('./hex-types.js').Hex} [data] - Transaction data
 */

/**
 * @typedef {TransactionSerializableBase & {
 *   type?: 'legacy',
 *   gasPrice?: bigint | number
 * }} TransactionSerializableLegacy
 */

/**
 * @typedef {{ address: import('./address-types.js').Address, storageKeys?: import('./hex-types.js').Hex[] }} AccessListItem
 */

/**
 * @typedef {TransactionSerializableBase & {
 *   type: 'eip2930',
 *   gasPrice?: bigint | number,
 *   accessList?: AccessListItem[]
 * }} TransactionSerializableEIP2930
 */

/**
 * @typedef {TransactionSerializableBase & {
 *   type: 'eip1559',
 *   maxFeePerGas?: bigint | number,
 *   maxPriorityFeePerGas?: bigint | number,
 *   accessList?: AccessListItem[]
 * }} TransactionSerializableEIP1559
 */

/**
 * @typedef {TransactionSerializableLegacy | TransactionSerializableEIP2930 | TransactionSerializableEIP1559} TransactionSerializable
 */

/**
 * @typedef {Object} Signature
 * @property {bigint} r - Signature r value
 * @property {bigint} s - Signature s value
 * @property {bigint | number} [v] - Recovery ID for legacy transactions
 * @property {number} [yParity] - Parity for EIP-2718 transactions
 */

/**
 * Convert a bigint to minimal-length RLP bytes (no leading zeros, but 0 encodes to empty bytes).
 * @param {bigint | number | undefined} value - Value to convert
 * @returns {Uint8Array} Minimal bytes representation
 */
function bigintToRlpBytes(value) {
	if (value === undefined || value === 0n || value === 0) {
		return new Uint8Array(0)
	}
	const bigValue = typeof value === 'number' ? BigInt(value) : value
	// Convert to hex without leading zeros, then to bytes
	const hex = bigValue.toString(16)
	const paddedHex = hex.length % 2 === 0 ? hex : `0${hex}`
	const bytes = new Uint8Array(paddedHex.length / 2)
	for (let i = 0; i < paddedHex.length; i += 2) {
		bytes[i / 2] = parseInt(paddedHex.slice(i, i + 2), 16)
	}
	return bytes
}

/**
 * Convert a hex string to bytes for RLP, handling empty/zero cases.
 * @param {import('./hex-types.js').Hex | undefined} hex - Hex string
 * @returns {Uint8Array} Bytes
 */
function hexToRlpBytesForTx(hex) {
	if (!hex || hex === '0x' || hex === '0x0') {
		return new Uint8Array(0)
	}
	// Remove 0x prefix and handle odd length
	let hexDigits = hex.slice(2)
	if (hexDigits.length % 2 !== 0) {
		hexDigits = '0' + hexDigits
	}
	const bytes = new Uint8Array(hexDigits.length / 2)
	for (let i = 0; i < hexDigits.length; i += 2) {
		bytes[i / 2] = parseInt(hexDigits.slice(i, i + 2), 16)
	}
	return bytes
}

/**
 * Convert an address to 20 bytes for RLP.
 * @param {import('./address-types.js').Address | undefined} address - Address
 * @returns {Uint8Array} 20-byte address or empty for null/undefined
 */
function addressToRlpBytes(address) {
	if (!address || address === '0x') {
		return new Uint8Array(0)
	}
	return hexToRlpBytesForTx(/** @type {import('./hex-types.js').Hex} */ (address.toLowerCase()))
}

/**
 * RLP encode bytes (string in RLP terms).
 * @param {Uint8Array} bytes - Bytes to encode
 * @returns {Uint8Array} RLP-encoded bytes
 */
function rlpEncodeBytesTx(bytes) {
	if (bytes.length === 1 && bytes[0] !== undefined && bytes[0] < 0x80) {
		return bytes
	}
	const prefix = rlpEncodeLengthTx(bytes.length, 0x80)
	const result = new Uint8Array(prefix.length + bytes.length)
	result.set(prefix, 0)
	result.set(bytes, prefix.length)
	return result
}

/**
 * Encode length prefix for RLP.
 * @param {number} length - Length to encode
 * @param {number} offset - Base offset (0x80 for strings, 0xc0 for lists)
 * @returns {Uint8Array} Length prefix bytes
 */
function rlpEncodeLengthTx(length, offset) {
	if (length < 56) {
		return new Uint8Array([offset + length])
	}
	const lengthBytes = []
	let temp = length
	while (temp > 0) {
		lengthBytes.unshift(temp & 0xff)
		temp = Math.floor(temp / 256)
	}
	const result = new Uint8Array(1 + lengthBytes.length)
	result[0] = offset + 55 + lengthBytes.length
	for (let i = 0; i < lengthBytes.length; i++) {
		result[1 + i] = /** @type {number} */ (lengthBytes[i])
	}
	return result
}

/**
 * RLP encode a list of already-encoded items.
 * @param {Uint8Array[]} items - Pre-encoded items
 * @returns {Uint8Array} RLP-encoded list
 */
function rlpEncodeListTx(items) {
	let totalLength = 0
	for (const item of items) {
		totalLength += item.length
	}
	const prefix = rlpEncodeLengthTx(totalLength, 0xc0)
	const result = new Uint8Array(prefix.length + totalLength)
	result.set(prefix, 0)
	let offset = prefix.length
	for (const item of items) {
		result.set(item, offset)
		offset += item.length
	}
	return result
}

/**
 * Encode access list for EIP-2930/EIP-1559 transactions.
 * @param {AccessListItem[] | undefined} accessList - Access list
 * @returns {Uint8Array} RLP-encoded access list
 */
function encodeAccessList(accessList) {
	if (!accessList || accessList.length === 0) {
		// Empty list: 0xc0
		return new Uint8Array([0xc0])
	}

	const encodedItems = []
	for (const item of accessList) {
		// Each item is [address, [storageKeys...]]
		const addressBytes = rlpEncodeBytesTx(addressToRlpBytes(item.address))

		// Encode storage keys as a list
		const storageKeyItems = []
		if (item.storageKeys && item.storageKeys.length > 0) {
			for (const key of item.storageKeys) {
				storageKeyItems.push(rlpEncodeBytesTx(hexToRlpBytesForTx(key)))
			}
		}
		const storageKeysList = rlpEncodeListTx(storageKeyItems)

		// Combine address and storage keys into a list
		const itemList = rlpEncodeListTx([addressBytes, storageKeysList])
		encodedItems.push(itemList)
	}

	return rlpEncodeListTx(encodedItems)
}

/**
 * Serialize a legacy transaction.
 * @param {TransactionSerializableLegacy} tx - Transaction
 * @param {Signature} [signature] - Optional signature
 * @returns {import('./hex-types.js').Hex} Serialized transaction
 */
function serializeLegacyTransaction(tx, signature) {
	// Legacy: [nonce, gasPrice, gasLimit, to, value, data, v, r, s]
	// Unsigned (EIP-155): [nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0]
	const items = [
		rlpEncodeBytesTx(bigintToRlpBytes(tx.nonce)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.gasPrice)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.gas)),
		rlpEncodeBytesTx(addressToRlpBytes(tx.to)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.value)),
		rlpEncodeBytesTx(hexToRlpBytesForTx(tx.data)),
	]

	if (signature) {
		// Signed transaction
		const v = signature.v !== undefined ? BigInt(signature.v) :
			(signature.yParity !== undefined ? BigInt(signature.yParity) + (tx.chainId ? BigInt(tx.chainId) * 2n + 35n : 27n) : 27n)
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(v)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.r)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.s)))
	} else if (tx.chainId !== undefined) {
		// Unsigned EIP-155 transaction
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(tx.chainId)))
		items.push(rlpEncodeBytesTx(new Uint8Array(0)))
		items.push(rlpEncodeBytesTx(new Uint8Array(0)))
	}

	const encoded = rlpEncodeListTx(items)
	return bytesToHex(encoded)
}

/**
 * Serialize an EIP-2930 transaction.
 * @param {TransactionSerializableEIP2930} tx - Transaction
 * @param {Signature} [signature] - Optional signature
 * @returns {import('./hex-types.js').Hex} Serialized transaction
 */
function serializeEIP2930Transaction(tx, signature) {
	// EIP-2930: 0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, signatureYParity, signatureR, signatureS])
	const items = [
		rlpEncodeBytesTx(bigintToRlpBytes(tx.chainId)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.nonce)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.gasPrice)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.gas)),
		rlpEncodeBytesTx(addressToRlpBytes(tx.to)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.value)),
		rlpEncodeBytesTx(hexToRlpBytesForTx(tx.data)),
		encodeAccessList(tx.accessList),
	]

	if (signature) {
		const yParity = signature.yParity ?? (signature.v !== undefined ? Number(signature.v) % 2 : 0)
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(yParity)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.r)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.s)))
	}

	const rlpEncoded = rlpEncodeListTx(items)
	// Prepend type byte (0x01)
	const result = new Uint8Array(1 + rlpEncoded.length)
	result[0] = 0x01
	result.set(rlpEncoded, 1)
	return bytesToHex(result)
}

/**
 * Serialize an EIP-1559 transaction.
 * @param {TransactionSerializableEIP1559} tx - Transaction
 * @param {Signature} [signature] - Optional signature
 * @returns {import('./hex-types.js').Hex} Serialized transaction
 */
function serializeEIP1559Transaction(tx, signature) {
	// EIP-1559: 0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, signatureYParity, signatureR, signatureS])
	const items = [
		rlpEncodeBytesTx(bigintToRlpBytes(tx.chainId)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.nonce)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.maxPriorityFeePerGas)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.maxFeePerGas)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.gas)),
		rlpEncodeBytesTx(addressToRlpBytes(tx.to)),
		rlpEncodeBytesTx(bigintToRlpBytes(tx.value)),
		rlpEncodeBytesTx(hexToRlpBytesForTx(tx.data)),
		encodeAccessList(tx.accessList),
	]

	if (signature) {
		const yParity = signature.yParity ?? (signature.v !== undefined ? Number(signature.v) % 2 : 0)
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(yParity)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.r)))
		items.push(rlpEncodeBytesTx(bigintToRlpBytes(signature.s)))
	}

	const rlpEncoded = rlpEncodeListTx(items)
	// Prepend type byte (0x02)
	const result = new Uint8Array(1 + rlpEncoded.length)
	result[0] = 0x02
	result.set(rlpEncoded, 1)
	return bytesToHex(result)
}

/**
 * Serialize a transaction object into its RLP-encoded form.
 * Native implementation that matches viem's serializeTransaction API.
 * Supports Legacy, EIP-2930, and EIP-1559 transaction types.
 * @param {TransactionSerializable} transaction - The transaction to serialize
 * @param {Signature} [signature] - Optional signature to include
 * @returns {import('./hex-types.js').Hex} The serialized transaction as a hex string
 * @example
 * ```javascript
 * import { serializeTransaction } from '@tevm/utils'
 *
 * // Serialize an EIP-1559 transaction
 * const serialized = serializeTransaction({
 *   chainId: 1,
 *   nonce: 0,
 *   maxPriorityFeePerGas: 1000000000n,
 *   maxFeePerGas: 2000000000n,
 *   gas: 21000n,
 *   to: '0x742d35Cc6634C0532925a3b844Bc9e7595f251e3',
 *   value: 1000000000000000000n,
 *   data: '0x',
 *   type: 'eip1559'
 * })
 *
 * // Serialize a legacy transaction
 * const legacySerialized = serializeTransaction({
 *   chainId: 1,
 *   nonce: 0,
 *   gasPrice: 20000000000n,
 *   gas: 21000n,
 *   to: '0x742d35Cc6634C0532925a3b844Bc9e7595f251e3',
 *   value: 1000000000000000000n,
 * })
 * ```
 */
export function serializeTransaction(transaction, signature) {
	const type = transaction.type

	if (type === 'eip1559') {
		return serializeEIP1559Transaction(/** @type {TransactionSerializableEIP1559} */ (transaction), signature)
	}

	if (type === 'eip2930') {
		return serializeEIP2930Transaction(/** @type {TransactionSerializableEIP2930} */ (transaction), signature)
	}

	// Default to legacy
	return serializeLegacyTransaction(/** @type {TransactionSerializableLegacy} */ (transaction), signature)
}

// ABI encoding/decoding - native implementation using @tevm/voltaire
export { encodeAbiParameters, decodeAbiParameters } from './abiEncoding.js'

// Function encoding/decoding - native implementation using @tevm/voltaire
export {
	encodeFunctionData,
	decodeFunctionData,
	decodeFunctionResult,
	encodeFunctionResult,
} from './abiFunctionEncoding.js'

// Event encoding/decoding - native implementation using @tevm/voltaire
export { decodeEventLog, encodeEventTopics } from './abiEventEncoding.js'

// Error encoding/decoding - native implementation using @tevm/voltaire
export { decodeErrorResult, encodeErrorResult } from './abiErrorEncoding.js'

// Deploy data encoding - native implementation using @tevm/voltaire
export { encodeDeployData } from './abiDeployEncoding.js'

// Contract error handling utilities - native implementation replacing viem
export { getContractError, RawContractError } from './getContractError.js'
export {
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
} from '@tevm/errors'

// Transport and client creation functions re-exported from viem
// These are used for fork client creation in state package
export {
	createPublicClient,
	createTransport,
	custom,
	defineChain,
	http,
	webSocket,
} from 'viem'

/**
 * Re-export viem's EIP1193RequestFn type for fork transport compatibility.
 * @typedef {import('viem').EIP1193RequestFn} EIP1193RequestFn
 */

/**
 * Re-export viem's Transport type for fork transport compatibility.
 * @typedef {import('viem').Transport} Transport
 */

/**
 * Re-export viem's PublicClient type for fork client compatibility.
 * @typedef {import('viem').PublicClient} PublicClient
 */
