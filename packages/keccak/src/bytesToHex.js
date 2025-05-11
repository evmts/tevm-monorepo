/**
 * @fileoverview Utility function to convert bytes to hex using WebAssembly
 */

import { getWasmInstance, bytesToHex as wasmBytesToHex } from './wasmLoader.js'

/**
 * Converts a byte array to a hex string with '0x' prefix.
 * This implementation uses WebAssembly for better performance.
 * Note: JavaScript implementations are often faster for this operation,
 * but this is provided for completeness and consistency.
 * 
 * @param {Uint8Array} bytes - A byte array
 * @returns {Promise<string>} A hex string with '0x' prefix
 * @throws {Error} If the WebAssembly module fails to load
 * 
 * @example
 * // Convert bytes to hex
 * const hex = await bytesToHex(new Uint8Array([104, 101, 108, 108, 111]))
 * console.log(hex) // 0x68656c6c6f
 */
export async function bytesToHex(bytes) {
  const wasmInstance = await getWasmInstance()
  return wasmBytesToHex(wasmInstance, bytes)
}