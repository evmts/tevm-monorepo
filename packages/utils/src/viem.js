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

export {
	boolToBytes,
	boolToHex,
	bytesToBigInt,
	bytesToBigint,
	bytesToBool,
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
	hexToBool,
	hexToNumber,
	hexToString,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	numberToHex,
	parseEther,
	parseGwei,
	serializeTransaction,
	stringToHex,
	toBytes,
	toHex,
	toRlp,
} from 'viem/utils'
