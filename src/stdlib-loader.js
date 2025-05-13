import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const wasmPath = resolve(__dirname, '../dist/stdlib.wasm')
const wasmBuffer = fs.readFileSync(wasmPath)

/**
 * Initializes the WebAssembly module
 * @returns {Promise<WebAssembly.Instance>} The WebAssembly instance
 */
export async function initWasm() {
	const { instance } = await WebAssembly.instantiate(wasmBuffer)

	// Debug: Log all available exports
	console.log('WASM exports:', Object.keys(instance.exports))

	return instance
}

/**
 * Convert hex string to bytes using Zig's implementation
 * @param {WebAssembly.Instance} instance - WASM instance
 * @param {string} hexString - Hex string (with or without 0x prefix)
 * @returns {Uint8Array} - Resulting byte array
 */
export function hexToBytes(instance, hexString) {
	const memory = instance.exports.memory

	// Convert hex string to UTF-8 encoding
	const encoder = new TextEncoder()
	const hexBytes = encoder.encode(hexString)

	// Ensure sufficient memory
	const inputLen = hexBytes.length
	const outputLen = Math.ceil(inputLen / 2) // Approximate length of binary output
	const memoryNeeded = inputLen + outputLen

	const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
	const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

	if (pagesNeeded > currentMemoryPages) {
		memory.grow(pagesNeeded - currentMemoryPages)
	}

	// Get memory buffer after potential resize
	const memoryArray = new Uint8Array(memory.buffer)

	// Input pointer (hex string)
	const inputPtr = 0
	memoryArray.set(hexBytes, inputPtr)

	// Output pointer (binary data)
	const outputPtr = inputLen

	// Call WASM function
	const bytesWritten = instance.exports.zig_hexToBytes(inputPtr, inputLen, outputPtr)

	// Copy output to a new array
	return new Uint8Array(memoryArray.buffer, outputPtr, bytesWritten)
}

/**
 * Convert bytes to hex string using Zig's implementation
 * @param {WebAssembly.Instance} instance - WASM instance
 * @param {Uint8Array} bytes - Byte array to convert
 * @returns {string} - Hex string with 0x prefix
 */
export function bytesToHex(instance, bytes) {
	const memory = instance.exports.memory

	// Ensure sufficient memory
	const inputLen = bytes.length
	const outputLen = 2 + inputLen * 2 // '0x' prefix + 2 chars per byte
	const memoryNeeded = inputLen + outputLen

	const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
	const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

	if (pagesNeeded > currentMemoryPages) {
		memory.grow(pagesNeeded - currentMemoryPages)
	}

	// Get memory buffer after potential resize
	const memoryArray = new Uint8Array(memory.buffer)

	// Input pointer (binary data)
	const inputPtr = 0
	memoryArray.set(bytes, inputPtr)

	// Output pointer (hex string)
	const outputPtr = inputLen

	// Call WASM function
	const hexLen = instance.exports.zig_bytesToHex(inputPtr, inputLen, outputPtr)

	// Convert output to JavaScript string
	const decoder = new TextDecoder()
	return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
}

/**
 * Compute keccak256 hash using our Zig WASM implementation
 * @param {WebAssembly.Instance} instance WASM instance
 * @param {string|Uint8Array} input Input data to hash (hex string or bytes)
 * @returns {string} Hex string hash result with 0x prefix
 */
export function keccak256(instance, input) {
	if (typeof input === 'string') {
		// Use the optimized all-in-one hex function
		const encoder = new TextEncoder()
		const hexBytes = encoder.encode(input)

		// Ensure memory is big enough
		const memory = instance.exports.memory
		const inputLen = hexBytes.length
		const outputLen = 2 + 32 * 2 // '0x' prefix + 2 chars per byte for 32 byte hash
		const memoryNeeded = inputLen + outputLen

		const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
		const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

		if (pagesNeeded > currentMemoryPages) {
			memory.grow(pagesNeeded - currentMemoryPages)
		}

		// Get memory buffer after potential resize
		const memoryArray = new Uint8Array(memory.buffer)

		// Input pointer (hex string)
		const inputPtr = 0
		memoryArray.set(hexBytes, inputPtr)

		// Output pointer (hex string hash)
		const outputPtr = inputLen

		// Call the all-in-one function
		const hexLen = instance.exports.zig_keccak256_hex(inputPtr, inputLen, outputPtr)

		// Convert output to JavaScript string
		const decoder = new TextDecoder()
		return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
	}
	// Input is Uint8Array
	const memory = instance.exports.memory

	// Ensure memory is large enough
	const inputLen = input.length
	const memoryNeeded = inputLen + 32 // Input bytes + 32 bytes for output hash

	const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
	const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

	if (pagesNeeded > currentMemoryPages) {
		memory.grow(pagesNeeded - currentMemoryPages)
	}

	// Get memory buffer after potential resize
	const memoryArray = new Uint8Array(memory.buffer)

	// Input pointer (binary data)
	const inputPtr = 0
	memoryArray.set(input, inputPtr)

	// Output pointer (binary hash)
	const outputPtr = inputLen

	// Call the keccak256 function
	instance.exports.zig_keccak256(inputPtr, inputLen, outputPtr)

	// Get the hash as bytes
	const hashBytes = new Uint8Array(memory.buffer, outputPtr, 32)

	// Convert to hex string
	return bytesToHex(instance, hashBytes)
}
