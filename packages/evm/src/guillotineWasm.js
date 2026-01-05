/**
 * Guillotine-mini WASM loader and wrapper
 *
 * This module provides a JavaScript interface to the guillotine-mini EVM WASM module.
 * The WASM binary must be built from lib/guillotine-mini using `zig build wasm`.
 *
 * Current Status: PENDING - WASM build has dependency resolution issues
 * See: lib/guillotine-mini/build.zig.zon for dependencies
 *
 * @module guillotineWasm
 */

/**
 * @typedef {Object} GuillotineInstance
 * @property {function(Uint8Array, number, number): number} evm_create - Create EVM instance
 * @property {function(number): void} evm_destroy - Destroy EVM instance
 * @property {function(number, Uint8Array, number): boolean} evm_set_bytecode - Set bytecode
 * @property {function(number, number, Uint8Array, Uint8Array, Uint8Array, Uint8Array, number): boolean} evm_set_execution_context - Set execution context
 * @property {function(number, Uint8Array, number, number, Uint8Array, Uint8Array, Uint8Array, number, Uint8Array, Uint8Array): void} evm_set_blockchain_context - Set blockchain context
 * @property {function(number): boolean} evm_execute - Execute bytecode
 * @property {function(number): number} evm_get_gas_remaining - Get remaining gas
 * @property {function(number): number} evm_get_gas_used - Get used gas
 * @property {function(number): number} evm_get_gas_refund - Get gas refund
 * @property {function(number): boolean} evm_is_success - Check if execution succeeded
 * @property {function(number): number} evm_get_output_len - Get output length
 * @property {function(number, Uint8Array, number): number} evm_get_output - Get output data
 * @property {function(number, Uint8Array, Uint8Array, Uint8Array): boolean} evm_set_storage - Set storage value
 * @property {function(number, Uint8Array, Uint8Array, Uint8Array): boolean} evm_get_storage - Get storage value
 * @property {function(number, Uint8Array, Uint8Array): boolean} evm_set_balance - Set account balance
 * @property {function(number, Uint8Array, Uint8Array, number): boolean} evm_set_code - Set account code
 * @property {function(number): number} evm_get_log_count - Get log count
 * @property {function(number): number} evm_get_storage_change_count - Get storage change count
 */

/**
 * @type {GuillotineInstance | null}
 */
let wasmInstance = null

/**
 * @type {Promise<GuillotineInstance> | null}
 */
let loadingPromise = null

/**
 * Convert a hex string to a 20-byte address array.
 * Handles both prefixed (0x...) and unprefixed hex strings.
 * Pads shorter values with leading zeros.
 *
 * @param {string} hex - Hex string (with or without 0x prefix)
 * @returns {Uint8Array} 20-byte array
 * @example
 * ```javascript
 * import { hexToAddress } from '@tevm/evm'
 *
 * // With 0x prefix
 * const addr1 = hexToAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
 *
 * // Without prefix
 * const addr2 = hexToAddress('742d35Cc6634C0532925a3b844Bc454e4438f44e')
 *
 * // Short address (padded with zeros)
 * const addr3 = hexToAddress('0x1')
 * ```
 */
export function hexToAddress(hex) {
	const clean = hex.startsWith('0x') ? hex.slice(2) : hex
	const padded = clean.padStart(40, '0')
	const bytes = new Uint8Array(20)
	for (let i = 0; i < 20; i++) {
		bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Convert a bigint to a 32-byte big-endian array.
 * Compatible with EVM's 256-bit word size.
 *
 * @param {bigint} value - Value to convert (0 to 2^256-1)
 * @returns {Uint8Array} 32-byte big-endian array
 * @example
 * ```javascript
 * import { u256ToBytes } from '@tevm/evm'
 *
 * const bytes = u256ToBytes(255n)
 * // Result: Uint8Array with 31 zero bytes followed by 0xff
 *
 * const maxBytes = u256ToBytes(2n ** 256n - 1n)
 * // Result: Uint8Array with all bytes set to 0xff
 * ```
 */
export function u256ToBytes(value) {
	const bytes = new Uint8Array(32)
	let v = value
	for (let i = 31; i >= 0; i--) {
		bytes[i] = Number(v & 0xffn)
		v >>= 8n
	}
	return bytes
}

/**
 * Convert a 32-byte big-endian array to bigint.
 * Handles arrays shorter than 32 bytes by treating missing bytes as zeros.
 *
 * @param {Uint8Array} bytes - Byte array (up to 32 bytes)
 * @returns {bigint} Value as bigint (0 to 2^256-1)
 * @example
 * ```javascript
 * import { bytesToU256 } from '@tevm/evm'
 *
 * const value = bytesToU256(new Uint8Array([0xff]))
 * // Result: 255n
 *
 * const fullValue = bytesToU256(new Uint8Array(32).fill(0xff))
 * // Result: 2n ** 256n - 1n
 * ```
 */
export function bytesToU256(bytes) {
	let value = 0n
	for (let i = 0; i < 32; i++) {
		value = (value << 8n) | BigInt(bytes[i] ?? 0)
	}
	return value
}

/**
 * Load the guillotine-mini WASM module
 *
 * @param {string | URL | Uint8Array} [wasmSource] - WASM source (path, URL, or binary)
 * @returns {Promise<GuillotineInstance>}
 * @throws {Error} If WASM cannot be loaded
 */
export async function loadGuillotineWasm(wasmSource) {
	if (wasmInstance) {
		return wasmInstance
	}

	if (loadingPromise) {
		return loadingPromise
	}

	loadingPromise = (async () => {
		/** @type {ArrayBuffer} */
		let wasmBuffer

		if (wasmSource instanceof Uint8Array) {
			wasmBuffer = wasmSource.buffer
		} else if (typeof wasmSource === 'string' || wasmSource instanceof URL) {
			// In Node.js, use fs.readFile
			if (typeof globalThis.process !== 'undefined' && globalThis.process.versions?.node) {
				const fs = await import('node:fs/promises')
				const path = await import('node:path')
				const resolvedPath = typeof wasmSource === 'string' ? path.resolve(wasmSource) : wasmSource.pathname
				wasmBuffer = await fs.readFile(resolvedPath)
			} else {
				// In browser, use fetch
				const response = await fetch(wasmSource)
				wasmBuffer = await response.arrayBuffer()
			}
		} else {
			throw new Error(
				'WASM source required. Build guillotine-mini with `zig build wasm` and provide the path to guillotine_mini.wasm',
			)
		}

		const imports = {
			env: {
				// Stub implementations for JavaScript callbacks
				js_opcode_callback: () => 0,
				js_precompile_callback: () => 0,
			},
			// WASI imports required for wasm32-wasi target
			// All functions return 0 (ERRNO_SUCCESS) or appropriate error codes
			wasi_snapshot_preview1: {
				// Process control
				proc_exit: () => {},
				sched_yield: () => 0,
				// File descriptors
				fd_write: () => 0,
				fd_read: () => 0,
				fd_close: () => 0,
				fd_seek: () => 0,
				fd_sync: () => 0,
				fd_tell: () => 0,
				fd_advise: () => 0,
				fd_allocate: () => 0,
				fd_datasync: () => 0,
				fd_fdstat_get: () => 0,
				fd_fdstat_set_flags: () => 0,
				fd_fdstat_set_rights: () => 0,
				fd_filestat_get: () => 0,
				fd_filestat_set_size: () => 0,
				fd_filestat_set_times: () => 0,
				fd_pread: () => 0,
				fd_pwrite: () => 0,
				fd_readdir: () => 0,
				fd_renumber: () => 0,
				fd_prestat_get: () => 8, // ERRNO_BADF - no preopened directories
				fd_prestat_dir_name: () => 8, // ERRNO_BADF
				// Path operations
				path_create_directory: () => 0,
				path_filestat_get: () => 0,
				path_filestat_set_times: () => 0,
				path_link: () => 0,
				path_open: () => 0,
				path_readlink: () => 0,
				path_remove_directory: () => 0,
				path_rename: () => 0,
				path_symlink: () => 0,
				path_unlink_file: () => 0,
				// Clock
				clock_res_get: () => 0,
				clock_time_get: () => 0,
				// Random
				random_get: () => 0,
				// Poll
				poll_oneoff: () => 0,
				// Environment
				environ_sizes_get: () => 0,
				environ_get: () => 0,
				args_sizes_get: () => 0,
				args_get: () => 0,
				// Socket (if needed)
				sock_accept: () => 0,
				sock_recv: () => 0,
				sock_send: () => 0,
				sock_shutdown: () => 0,
			},
		}

		const wasmModule = await WebAssembly.compile(wasmBuffer)
		const instance = await WebAssembly.instantiate(wasmModule, imports)

		wasmInstance = /** @type {GuillotineInstance} */ (instance.exports)
		return wasmInstance
	})()

	return loadingPromise
}

/**
 * Check if the guillotine WASM is loaded
 * @returns {boolean}
 */
export function isGuillotineLoaded() {
	return wasmInstance !== null
}

/**
 * Get the loaded guillotine instance
 * @returns {GuillotineInstance | null}
 */
export function getGuillotineInstance() {
	return wasmInstance
}

/**
 * Reset the WASM instance (useful for testing)
 */
export function resetGuillotineInstance() {
	wasmInstance = null
	loadingPromise = null
}

/**
 * @typedef {Object} GuillotineEvmHandle
 * @property {number} handle - Native handle
 * @property {GuillotineInstance} wasm - WASM instance
 */

/**
 * Create a new EVM execution context
 *
 * @param {GuillotineInstance} wasm - WASM instance
 * @param {Object} options - EVM options
 * @param {string} [options.hardfork='Cancun'] - Hardfork name
 * @param {number} [options.logLevel=0] - Log level (0=none)
 * @returns {GuillotineEvmHandle | null}
 */
export function createGuillotineEvm(wasm, options = {}) {
	const hardfork = options.hardfork ?? 'Cancun'
	const logLevel = options.logLevel ?? 0

	const hardforkBytes = new TextEncoder().encode(hardfork)
	const handle = wasm.evm_create(hardforkBytes, hardforkBytes.length, logLevel)

	if (!handle) {
		return null
	}

	return { handle, wasm }
}

/**
 * Destroy an EVM execution context
 * @param {GuillotineEvmHandle} evm - EVM handle
 */
export function destroyGuillotineEvm(evm) {
	evm.wasm.evm_destroy(evm.handle)
}

/**
 * Execute bytecode in the EVM
 *
 * @param {GuillotineEvmHandle} evm - EVM handle
 * @param {Object} context - Execution context
 * @param {Uint8Array} context.bytecode - Bytecode to execute
 * @param {bigint} context.gas - Gas limit
 * @param {Uint8Array} context.caller - Caller address (20 bytes)
 * @param {Uint8Array} context.address - Contract address (20 bytes)
 * @param {bigint} [context.value=0n] - Value to send
 * @param {Uint8Array} [context.calldata] - Call data
 * @param {bigint} [context.chainId=1n] - Chain ID
 * @param {bigint} [context.blockNumber=0n] - Block number
 * @param {bigint} [context.blockTimestamp=0n] - Block timestamp
 * @param {bigint} [context.blockGasLimit=30000000n] - Block gas limit
 * @param {bigint} [context.baseFee=0n] - Base fee
 * @returns {{ success: boolean, gasUsed: bigint, gasRemaining: bigint, gasRefund: bigint, output: Uint8Array }}
 */
/**
 * Set storage value for an address before execution
 *
 * @param {GuillotineEvmHandle} evm - EVM handle
 * @param {Uint8Array} address - Contract address (20 bytes)
 * @param {bigint} slot - Storage slot
 * @param {bigint} value - Storage value
 * @returns {boolean} True if successful
 */
export function setStorage(evm, address, slot, value) {
	const { wasm, handle } = evm
	const slotBytes = u256ToBytes(slot)
	const valueBytes = u256ToBytes(value)
	return wasm.evm_set_storage(handle, address, slotBytes, valueBytes)
}

/**
 * Get storage value for an address
 *
 * @param {GuillotineEvmHandle} evm - EVM handle
 * @param {Uint8Array} address - Contract address (20 bytes)
 * @param {bigint} slot - Storage slot
 * @returns {bigint} Storage value
 */
export function getStorage(evm, address, slot) {
	const { wasm, handle } = evm
	const slotBytes = u256ToBytes(slot)
	const valueBytes = new Uint8Array(32)
	wasm.evm_get_storage(handle, address, slotBytes, valueBytes)
	return bytesToU256(valueBytes)
}

/**
 * Helper to allocate and write data to WASM memory
 * @param {GuillotineInstance} wasm - WASM instance
 * @param {Uint8Array} data - Data to write
 * @param {number} offset - Memory offset to write at
 */
function writeToWasmMemory(wasm, data, offset) {
	const memory = new Uint8Array(wasm.memory.buffer)
	memory.set(data, offset)
}

/**
 * Helper to read data from WASM memory
 * @param {GuillotineInstance} wasm - WASM instance
 * @param {number} offset - Memory offset to read from
 * @param {number} length - Number of bytes to read
 * @returns {Uint8Array}
 */
function readFromWasmMemory(wasm, offset, length) {
	const memory = new Uint8Array(wasm.memory.buffer)
	return memory.slice(offset, offset + length)
}

// Memory layout for execution parameters (starting at 64KB to avoid WASM stack)
const MEM_BASE = 0x10000
const MEM_BYTECODE = MEM_BASE + 0x0000 // variable size, up to 24KB
const MEM_CALLER = MEM_BASE + 0x6000 // 20 bytes
const MEM_ADDRESS = MEM_BASE + 0x6020 // 20 bytes
const MEM_VALUE = MEM_BASE + 0x6040 // 32 bytes
const MEM_CALLDATA = MEM_BASE + 0x6060 // variable size, up to 4KB
const MEM_CHAIN_ID = MEM_BASE + 0x7060 // 32 bytes
const MEM_DIFFICULTY = MEM_BASE + 0x7080 // 32 bytes
const MEM_PREVRANDAO = MEM_BASE + 0x70A0 // 32 bytes
const MEM_COINBASE = MEM_BASE + 0x70C0 // 20 bytes
const MEM_BASE_FEE = MEM_BASE + 0x70E0 // 32 bytes
const MEM_BLOB_FEE = MEM_BASE + 0x7100 // 32 bytes
const MEM_OUTPUT = MEM_BASE + 0x7120 // variable size

export function executeGuillotine(evm, context) {
	const { wasm, handle } = evm

	// Write bytecode to WASM memory
	writeToWasmMemory(wasm, context.bytecode, MEM_BYTECODE)
	if (!wasm.evm_set_bytecode(handle, MEM_BYTECODE, context.bytecode.length)) {
		throw new Error('Failed to set bytecode')
	}

	// Write execution context to WASM memory
	const valueBytes = u256ToBytes(context.value ?? 0n)
	const calldata = context.calldata ?? new Uint8Array(0)

	writeToWasmMemory(wasm, context.caller, MEM_CALLER)
	writeToWasmMemory(wasm, context.address, MEM_ADDRESS)
	writeToWasmMemory(wasm, valueBytes, MEM_VALUE)
	if (calldata.length > 0) {
		writeToWasmMemory(wasm, calldata, MEM_CALLDATA)
	}

	// Set execution context with memory pointers
	const setContextResult = wasm.evm_set_execution_context(
		handle,
		BigInt(context.gas),
		MEM_CALLER,
		MEM_ADDRESS,
		MEM_VALUE,
		calldata.length > 0 ? MEM_CALLDATA : 0,
		calldata.length,
	)
	if (!setContextResult) {
		throw new Error('Failed to set execution context')
	}

	// Write blockchain context to WASM memory
	const chainId = u256ToBytes(context.chainId ?? 1n)
	const blockDifficulty = u256ToBytes(0n)
	const blockPrevrandao = u256ToBytes(0n)
	const blockCoinbase = new Uint8Array(20) // zero address
	const baseFee = u256ToBytes(context.baseFee ?? 0n)
	const blobBaseFee = u256ToBytes(1n)

	writeToWasmMemory(wasm, chainId, MEM_CHAIN_ID)
	writeToWasmMemory(wasm, blockDifficulty, MEM_DIFFICULTY)
	writeToWasmMemory(wasm, blockPrevrandao, MEM_PREVRANDAO)
	writeToWasmMemory(wasm, blockCoinbase, MEM_COINBASE)
	writeToWasmMemory(wasm, baseFee, MEM_BASE_FEE)
	writeToWasmMemory(wasm, blobBaseFee, MEM_BLOB_FEE)

	// Set blockchain context with memory pointers
	wasm.evm_set_blockchain_context(
		handle,
		MEM_CHAIN_ID,
		BigInt(context.blockNumber ?? 0n),
		BigInt(context.blockTimestamp ?? 0n),
		MEM_DIFFICULTY,
		MEM_PREVRANDAO,
		MEM_COINBASE,
		BigInt(context.blockGasLimit ?? 30000000n),
		MEM_BASE_FEE,
		MEM_BLOB_FEE,
	)

	// Execute
	// WASM bool returns as i8 (0 or 1), convert to JS boolean
	const success = Boolean(wasm.evm_execute(handle))

	// Get results
	const gasUsed = BigInt(wasm.evm_get_gas_used(handle))
	const gasRemaining = BigInt(wasm.evm_get_gas_remaining(handle))
	const gasRefund = BigInt(wasm.evm_get_gas_refund(handle))

	// Get output
	const outputLen = wasm.evm_get_output_len(handle)
	let output = new Uint8Array(0)
	if (outputLen > 0) {
		// Need to read from WASM memory for output too
		writeToWasmMemory(wasm, new Uint8Array(outputLen), MEM_OUTPUT)
		wasm.evm_get_output(handle, MEM_OUTPUT, outputLen)
		output = readFromWasmMemory(wasm, MEM_OUTPUT, outputLen)
	}

	return {
		success,
		gasUsed,
		gasRemaining,
		gasRefund,
		output,
	}
}
