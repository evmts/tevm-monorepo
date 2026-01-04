// All these are needed to use tevm and there is no reason to reinvent the wheel on these viem utils
// Migration note: bytesToHex and hexToBytes now use native implementations instead of viem (following voltaire pattern)
export { formatAbi, parseAbi } from 'abitype'
export { mnemonicToAccount } from 'viem/accounts'
import { keccak_256 } from '@noble/hashes/sha3.js'

/**
 * Convert bytes to hex string.
 * Native implementation that matches viem's bytesToHex API.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {import('viem').Hex} The hex string (e.g., '0x1234')
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
	return /** @type {import('viem').Hex} */ (hex)
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
 * @param {import('viem').Hex} hex - The hex string to convert (must start with '0x')
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
 * @param {import('viem').Hex} hex - The hex string to convert (must start with '0x')
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
 * @param {import('viem').Hex} hex - The hex string to convert (must start with '0x')
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
 * @returns {import('viem').Hex} The hex string (e.g., '0xff')
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
		return /** @type {import('viem').Hex} */ (`0x${encoded.toString(16).padStart(size * 2, '0')}`)
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
		return /** @type {import('viem').Hex} */ (`0x${hex.padStart(expectedLength, '0')}`)
	}

	// Default: no padding, just convert
	return /** @type {import('viem').Hex} */ (`0x${bigIntValue.toString(16)}`)
}

/**
 * Convert boolean to hex string.
 * Native implementation that matches viem's boolToHex API.
 * @param {boolean} value - The boolean value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding (e.g., 32 for ABI encoding)
 * @returns {import('viem').Hex} The hex string ('0x1' for true, '0x0' for false)
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
		return /** @type {import('viem').Hex} */ (`0x${hex.padStart(opts.size * 2, '0')}`)
	}
	return /** @type {import('viem').Hex} */ (`0x${hex}`)
}

/**
 * Convert hex string to boolean.
 * Native implementation that matches viem's hexToBool API.
 * @param {import('viem').Hex} hex - The hex string to convert (must be '0x0', '0x00', '0x1', '0x01', etc.)
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
 * @returns {value is import('viem').Hex} True if the value is a valid hex string
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
 * @returns {import('viem').Hex} The hex string (e.g., '0x68656c6c6f' for 'hello')
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
 * @param {import('viem').Hex} hex - The hex string to convert (must start with '0x')
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
 * @returns {address is import('viem').Address} True if the value is a valid Ethereum address
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
 * Compute Keccak-256 hash.
 * Native implementation that matches viem's keccak256 API.
 * Uses @noble/hashes for the underlying implementation (same as voltaire).
 * @param {Uint8Array | import('viem').Hex} value - The value to hash (bytes or hex string)
 * @param {'bytes' | 'hex'} [to='hex'] - Output format: 'hex' returns Hex string, 'bytes' returns Uint8Array
 * @returns {import('viem').Hex} The Keccak-256 hash (returns Hex by default, Uint8Array if to='bytes')
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
	// Hash using noble/hashes
	const hash = keccak_256(bytes)
	// Return in requested format
	return /** @type {import('viem').Hex} */ (to === 'bytes' ? hash : bytesToHex(hash))
}

/**
 * Convert an Ethereum address to its checksummed version (EIP-55).
 * Native implementation that matches viem's getAddress API.
 * Uses keccak256 to compute the checksum based on the address characters.
 * @param {string} address - The address to checksum (must be a valid 40-char hex address)
 * @returns {import('viem').Address} The checksummed address
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

	return /** @type {import('viem').Address} */ (checksummed)
}

/**
 * Polymorphic function to convert various types to hex string.
 * Native implementation that matches viem's toHex API.
 * @param {string | number | bigint | boolean | Uint8Array} value - The value to convert
 * @param {Object} [opts] - Options
 * @param {number} [opts.size] - Size in bytes for padding
 * @returns {import('viem').Hex} The hex string (e.g., '0x1234')
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
 * @param {import('viem').Hex} hex - The hex string to convert (must start with '0x')
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
 * @param {string | number | bigint | boolean | import('viem').Hex} value - The value to convert
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
			const bytes = hexToBytes(/** @type {import('viem').Hex} */ (value))
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
 * @returns {TTo extends 'string' ? string : TTo extends 'number' ? number : TTo extends 'bigint' ? bigint : TTo extends 'boolean' ? boolean : import('viem').Hex} The converted value
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

export {
	decodeAbiParameters,
	decodeErrorResult,
	decodeEventLog,
	decodeFunctionData,
	decodeFunctionResult,
	encodeAbiParameters,
	encodeDeployData,
	encodeErrorResult,
	encodeEventTopics,
	encodeFunctionData,
	encodeFunctionResult,
	encodePacked,
	formatLog,
	fromRlp,
	serializeTransaction,
	toRlp,
} from 'viem/utils'
