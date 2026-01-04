// All these are needed to use tevm and there is no reason to reinvent the wheel on these viem utils
// Migration note: bytesToHex now uses native implementation instead of viem (following voltaire pattern)
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
	hexToBigInt,
	hexToBool,
	hexToBytes,
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
