// All these are needed to use tevm and there is no reason to reinvent the wheel on these viem utils
// Migration note: bytesToHex and hexToBytes now use native implementations instead of viem (following voltaire pattern)
export { formatAbi, parseAbi } from 'abitype'
export { mnemonicToAccount } from 'viem/accounts'

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

export {
	bytesToBigInt,
	bytesToBigint,
	bytesToNumber,
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
	formatEther,
	formatGwei,
	formatLog,
	fromBytes,
	fromHex,
	fromRlp,
	getAddress,
	hexToString,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	parseEther,
	parseGwei,
	serializeTransaction,
	stringToHex,
	toBytes,
	toHex,
	toRlp,
} from 'viem/utils'
