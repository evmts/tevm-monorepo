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
		const byte = bytes[i]
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
		const high = hexCharToValue[paddedHex[i]]
		const low = hexCharToValue[paddedHex[i + 1]]
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
export function hexToString(hex, opts) {
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
export function isAddress(address, opts) {
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
 * @returns {import('viem').Hex | Uint8Array} The Keccak-256 hash
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
	return to === 'bytes' ? hash : bytesToHex(hash)
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
	fromBytes,
	fromHex,
	fromRlp,
	getAddress,
	serializeTransaction,
	toBytes,
	toHex,
	toRlp,
} from 'viem/utils'
