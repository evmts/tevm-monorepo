/**
 * @fileoverview Utility function to convert hex to bytes using WebAssembly
 */

import { getWasmInstance, hexToBytes as wasmHexToBytes } from './wasmLoader.js'

/**
 * Converts a hex string to a byte array.
 * This implementation uses WebAssembly for better performance.
 * Note: JavaScript implementations are often faster for this operation,
 * but this is provided for completeness and consistency.
 * 
 * @param {string} hex - A hex string (with or without '0x' prefix)
 * @returns {Promise<Uint8Array>} A byte array
 * @throws {Error} If the WebAssembly module fails to load
 * 
 * @example
 * // Convert hex to bytes
 * const bytes = await hexToBytes('0x68656c6c6f')
 * console.log(bytes) // Uint8Array [ 104, 101, 108, 108, 111 ]
 */
export async function hexToBytes(hex) {
  const wasmInstance = await getWasmInstance()
  return wasmHexToBytes(wasmInstance, hex)
}