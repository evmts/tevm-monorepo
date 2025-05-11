/**
 * @fileoverview High-performance keccak256 hash function using WebAssembly
 */

import { getWasmInstance, keccak256 as wasmKeccak256 } from './wasmLoader.js'

/**
 * Computes the keccak256 hash of the input and returns it as a hex string with '0x' prefix.
 * This implementation uses WebAssembly for significantly better performance compared to
 * pure JavaScript implementations (up to ~6.2x faster for 32-byte inputs).
 * 
 * @param {Uint8Array|string} input - Either a hex string (with or without '0x' prefix) or a byte array
 * @returns {Promise<string>} The hash as a hex string with '0x' prefix
 * @throws {Error} If the WebAssembly module fails to load
 * 
 * @example
 * // Hash a hex string
 * const hash1 = await keccak256('0x68656c6c6f20776f726c64')
 * console.log(hash1) // 0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad
 * 
 * // Hash bytes
 * const hash2 = await keccak256(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))
 * console.log(hash2) // 0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad
 */
export async function keccak256(input) {
  const wasmInstance = await getWasmInstance()
  return wasmKeccak256(wasmInstance, input)
}