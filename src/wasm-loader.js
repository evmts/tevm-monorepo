import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const wasmPath = resolve(__dirname, '../dist/zigevm.wasm')
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
 * Instantiates a ZIG WebAssembly module with a provided buffer
 * @param {ArrayBuffer} wasmBuffer - WebAssembly binary data
 * @returns {Promise<{keccak256: Function, hexToBytes: Function, bytesToHex: Function, hexToBytesStdlib: Function, bytesToHexStdlib: Function, keccak256Stdlib: Function}>} Module with exposed functions
 */
export async function instantiateZigModule(wasmBuffer) {
	const { instance } = await WebAssembly.instantiate(wasmBuffer)

	return {
		keccak256: (input) => keccak256(instance, input),
		hexToBytes: (hexStr) => hexToBytes(instance, hexStr),
		bytesToHex: (bytes) => bytesToHex(instance, bytes),
		hexToBytesStdlib: (hexStr) => hexToBytesStdlib(instance, hexStr),
		bytesToHexStdlib: (bytes) => bytesToHexStdlib(instance, bytes),
		keccak256Stdlib: (input) => keccak256Stdlib(instance, input),

		// Added old implementations
		hexToBytesOld: (hexStr) => {
			const memory = instance.exports.memory
			const encoder = new TextEncoder()
			const hexBytes = encoder.encode(hexStr)

			const inputLen = hexBytes.length
			const outputLen = Math.ceil(inputLen / 2)
			const memoryNeeded = inputLen + outputLen

			const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
			const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

			if (pagesNeeded > currentMemoryPages) {
				memory.grow(pagesNeeded - currentMemoryPages)
			}

			const memoryArray = new Uint8Array(memory.buffer)
			const inputPtr = 0
			memoryArray.set(hexBytes, inputPtr)
			const outputPtr = inputLen

			const bytesWritten = instance.exports.zig_hexToBytes_old(inputPtr, inputLen, outputPtr)
			return new Uint8Array(memoryArray.buffer, outputPtr, bytesWritten)
		},

		bytesToHexOld: (bytes) => {
			const memory = instance.exports.memory
			const inputLen = bytes.length
			const outputLen = 2 + inputLen * 2
			const memoryNeeded = inputLen + outputLen

			const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
			const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

			if (pagesNeeded > currentMemoryPages) {
				memory.grow(pagesNeeded - currentMemoryPages)
			}

			const memoryArray = new Uint8Array(memory.buffer)
			const inputPtr = 0
			memoryArray.set(bytes, inputPtr)
			const outputPtr = inputLen

			const hexLen = instance.exports.zig_bytesToHex_old(inputPtr, inputLen, outputPtr)
			const decoder = new TextDecoder()
			return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
		},

		keccak256Old: (input) => {
			if (typeof input === 'string') {
				const encoder = new TextEncoder()
				const hexBytes = encoder.encode(input)

				const memory = instance.exports.memory
				const inputLen = hexBytes.length
				const outputLen = 2 + 32 * 2
				const memoryNeeded = inputLen + outputLen

				const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
				const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

				if (pagesNeeded > currentMemoryPages) {
					memory.grow(pagesNeeded - currentMemoryPages)
				}

				const memoryArray = new Uint8Array(memory.buffer)
				const inputPtr = 0
				memoryArray.set(hexBytes, inputPtr)
				const outputPtr = inputLen

				const hexLen = instance.exports.zig_keccak256_hex_old(inputPtr, inputLen, outputPtr)
				const decoder = new TextDecoder()
				return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
			}
			const hashBytes = keccak256Bytes(instance, input)
			const bytesToHexFn = instance.bytesToHexOld || bytesToHexOld
			return bytesToHexFn(instance, hashBytes)
		},
	}
}

/**
 * Creates memory for use with WASM
 * @param {number} size Size in pages (64KB per page)
 * @returns {WebAssembly.Memory} WebAssembly memory
 */
export function createWasmMemory(size = 1) {
	return new WebAssembly.Memory({ initial: size, maximum: 100 })
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
	return decoder.decode(new Uint8Array(memoryArray.buffer, outputPtr, hexLen))
}

/**
 * Compute keccak256 hash using our Zig WASM implementation with binary input/output
 * @param {WebAssembly.Instance} instance WASM instance
 * @param {Uint8Array} input Input data to hash
 * @returns {Uint8Array} 32-byte hash result
 */
export function keccak256Bytes(instance, input) {
	// Ensure our memory is large enough
	const memory = instance.exports.memory

	// Ensure memory is large enough for input and output (input + 32 bytes for output)
	const memoryNeeded = input.length + 32
	const currentMemoryPages = memory.buffer.byteLength / (64 * 1024)
	const pagesNeeded = Math.ceil(memoryNeeded / (64 * 1024))

	if (pagesNeeded > currentMemoryPages) {
		memory.grow(pagesNeeded - currentMemoryPages)
	}

	// Get the current memory buffer after potential growth
	const memoryArray = new Uint8Array(memory.buffer)

	// Allocate memory for input (starting at position 0)
	const inputPtr = 0
	const inputLen = input.length

	// Write input to memory
	memoryArray.set(input, inputPtr)

	// Output buffer starts after input
	const outputPtr = inputPtr + inputLen

	// Call WASM function
	instance.exports.zig_keccak256(inputPtr, inputLen, outputPtr)

	// Read result from memory
	const result = new Uint8Array(32)
	for (let i = 0; i < 32; i++) {
		result[i] = memoryArray[outputPtr + i]
	}

	return result
}

/**
 * Compute keccak256 hash with hex string input/output
 * This version accepts either a Uint8Array or a hex string and returns a hex string,
 * matching the viem interface.
 *
 * @param {WebAssembly.Instance} instance WASM instance
 * @param {Uint8Array|string} input Input data to hash (Uint8Array or hex string)
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
		return decoder.decode(new Uint8Array(memoryArray.buffer, outputPtr, hexLen))
	}
	// Input is Uint8Array, hash it and convert to hex
	const hashBytes = keccak256Bytes(instance, input)
	return bytesToHex(instance, hashBytes)
}

/**
 * Convert hex string to bytes using Zig's stdlib implementation
 * @param {WebAssembly.Instance} instance - WASM instance
 * @param {string} hexString - Hex string (with or without 0x prefix)
 * @returns {Uint8Array} - Resulting byte array
 */
export function hexToBytesStdlib(instance, hexString) {
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
	const bytesWritten = instance.exports.zig_hexToBytes_stdlib(inputPtr, inputLen, outputPtr)

	// Copy output to a new array
	return new Uint8Array(memoryArray.buffer, outputPtr, bytesWritten)
}

/**
 * Convert bytes to hex string using Zig's stdlib implementation
 * @param {WebAssembly.Instance} instance - WASM instance
 * @param {Uint8Array} bytes - Byte array to convert
 * @returns {string} - Hex string with 0x prefix
 */
export function bytesToHexStdlib(instance, bytes) {
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
	const hexLen = instance.exports.zig_bytesToHex_stdlib(inputPtr, inputLen, outputPtr)

	// Convert output to JavaScript string
	const decoder = new TextDecoder()
	return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
}

/**
 * Compute keccak256 hash using Zig stdlib implementation for conversions
 * @param {WebAssembly.Instance} instance WASM instance
 * @param {string|Uint8Array} input Input data to hash (hex string or bytes)
 * @returns {string} Hex string hash result with 0x prefix
 */
export function keccak256Stdlib(instance, input) {
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
		const hexLen = instance.exports.zig_keccak256_hex_stdlib(inputPtr, inputLen, outputPtr)

		// Convert output to JavaScript string
		const decoder = new TextDecoder()
		return decoder.decode(new Uint8Array(memory.buffer, outputPtr, hexLen))
	}
	// Input is Uint8Array, hash it and convert to hex
	const hashBytes = keccak256Bytes(instance, input)
	return bytesToHexStdlib(instance, hashBytes)
}

// Run the init function when this module is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	;(async () => {
		try {
			const instance = await initWasm()
			console.log('WASM exports details:')
			for (const key of Object.keys(instance.exports)) {
				console.log(`- ${key}: ${typeof instance.exports[key]}`)
			}

			// Test runEvm function
			if (instance.exports.runEvm) {
				console.log('Result of runEvm():', instance.exports.runEvm())
			}
		} catch (err) {
			console.error('Error loading WASM:', err)
		}
	})()
}
