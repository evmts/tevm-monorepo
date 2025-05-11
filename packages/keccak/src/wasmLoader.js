/**
 * @fileoverview WebAssembly module loader for keccak256 implementation
 */

// The WebAssembly module instance
/** @type {WebAssembly.Instance|null} */
let wasmInstance = null

/** 
 * @type {Promise<WebAssembly.Instance>|null} 
 */
let wasmInstancePromise = null

/**
 * Lazy loads the WebAssembly module
 * @returns {Promise<WebAssembly.Instance>} The WebAssembly instance
 */
export async function getWasmInstance() {
  if (wasmInstance) {
    return wasmInstance
  }

  if (wasmInstancePromise) {
    return wasmInstancePromise
  }

  wasmInstancePromise = (async () => {
    try {
      // Get the path to the wasm file
      const wasmPath = new URL('../keccak.wasm', import.meta.url)
      
      // Fetch the wasm file
      const response = await fetch(wasmPath)
      const wasmBuffer = await response.arrayBuffer()
      
      // Instantiate the wasm module
      const { instance } = await WebAssembly.instantiate(wasmBuffer)
      
      wasmInstance = instance
      return instance
    } catch (error) {
      // Clear the promise so we can try again
      wasmInstancePromise = null
      throw new Error(`Failed to load keccak WebAssembly module: ${error.message}`)
    }
  })()

  return wasmInstancePromise
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
  return new Uint8Array(memoryArray.buffer.slice(outputPtr, outputPtr + bytesWritten))
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
  const outputLen = 2 + (inputLen * 2) // '0x' prefix + 2 chars per byte
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
    const outputLen = 2 + (32 * 2) // '0x' prefix + 2 chars per byte for 32 byte hash
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
  } else {
    // Input is Uint8Array, hash it and convert to hex
    const hashBytes = keccak256Bytes(instance, input)
    return bytesToHex(instance, hashBytes)
  }
}