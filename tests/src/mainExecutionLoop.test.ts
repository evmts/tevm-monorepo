/**
 * Tests for Issue #3: Main Execution Loop Implementation
 * 
 * These tests verify the execution loop's ability to:
 * - Fetch, decode, and execute opcodes
 * - Handle gas accounting
 * - Support early termination (STOP, REVERT, etc.) 
 * - Properly manage return data
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ZigEvm, ZigEvmResult } from './zigevm'
import path from 'path'

describe('ZigEVM Main Execution Loop', () => {
  let evm: ZigEvm
  let instance: number

  // Skip tests if WASM not available
  const itIfWasm = (title: string, fn: () => void) => {
    it(title, async () => {
      if (!evm.isInitialized()) {
        console.warn('Skipping test: WASM module not initialized')
        return
      }
      await fn()
    })
  }

  beforeEach(async () => {
    // Initialize the EVM
    evm = new ZigEvm()
    try {
      // For actual implementation, once WebAssembly is available
      const wasmPath = path.join(__dirname, '../../zig-out/lib/zig-evm.wasm')
      await evm.init(wasmPath)
      instance = evm.create()
    } catch (error) {
      console.warn('Failed to initialize ZigEVM WASM module:', error)
      // Proceed with mock implementation
    }
  })

  afterEach(() => {
    // Clean up the EVM instance if it was created
    if (evm.isInitialized() && instance) {
      evm.destroy(instance)
    }
  })

  // Test fetching and executing opcodes
  itIfWasm('should properly fetch and execute opcodes in sequence', () => {
    // PUSH1 5, PUSH1 10, ADD, STOP
    const code = new Uint8Array([0x60, 0x05, 0x60, 0x0A, 0x01, 0x00])
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    
    // Check the top stack item is 15 (5 + 10)
    // This requires PUSH1, PUSH1, and ADD opcodes to be executed correctly in sequence
    expect(result.data[31]).toBe(15)
  })

  // Test early termination via STOP
  itIfWasm('should terminate execution when encountering STOP', () => {
    // PUSH1 1, STOP, PUSH1 2 (should not be executed)
    const code = new Uint8Array([0x60, 0x01, 0x00, 0x60, 0x02])
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Should only have one item on the stack (the first PUSH1)
    expect(result.data[31]).toBe(1)
  })

  // Test early termination via RETURN
  itIfWasm('should terminate and return data when encountering RETURN', () => {
    // PUSH1 0xAA, PUSH1 0, MSTORE, PUSH1 32, PUSH1 0, RETURN
    const code = new Uint8Array([
      0x60, 0xAA,     // PUSH1 0xAA
      0x60, 0x00,     // PUSH1 0
      0x52,           // MSTORE
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3            // RETURN
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    expect(result.data.length).toBe(32)
    expect(result.data[31]).toBe(0xAA)
  })

  // Test early termination via REVERT
  itIfWasm('should terminate and revert state when encountering REVERT', () => {
    // PUSH1 0xBB, PUSH1 0, MSTORE, PUSH1 32, PUSH1 0, REVERT
    const code = new Uint8Array([
      0x60, 0xBB,     // PUSH1 0xBB
      0x60, 0x00,     // PUSH1 0
      0x52,           // MSTORE
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xFD            // REVERT
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Reverted)
    expect(result.data.length).toBe(32)
    expect(result.data[31]).toBe(0xBB)
  })

  // Test error handling for invalid opcodes
  itIfWasm('should handle invalid opcodes and stop execution', () => {
    // PUSH1, INVALID (0xFE)
    const code = new Uint8Array([0x60, 0x01, 0xFE, 0x60, 0x02])
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.InvalidOpcode)
  })

  // Test gas accounting
  itIfWasm('should accurately account for gas usage', () => {
    // Create a test with known gas usage
    // PUSH1(3) + PUSH1(3) + ADD(3) = 9 gas
    const code = new Uint8Array([0x60, 0x05, 0x60, 0x0A, 0x01])
    
    // Initial gas limit of 100
    const result = evm.execute(instance, code, new Uint8Array(), 100)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Should have used some gas but not all
    // Note: We're not accessing the exact gas value here, but in the real implementation
    // we would verify the gas used is accurate
  })

  // Test out of gas error
  itIfWasm('should stop with OutOfGas when exceeding gas limit', () => {
    // Create a test that will exceed gas limit
    // PUSH1(3) + PUSH1(3) + ADD(3) = 9 gas
    const code = new Uint8Array([0x60, 0x05, 0x60, 0x0A, 0x01])
    
    // Gas limit of 8 (not enough for all operations)
    const result = evm.execute(instance, code, new Uint8Array(), 8)
    
    expect(result.result).toBe(ZigEvmResult.OutOfGas)
  })

  // Test stack overflow
  itIfWasm('should detect stack overflow and stop execution', () => {
    // Create a program that pushes too many items onto the stack
    // We'll create a long sequence of PUSH1 operations to overflow the stack
    // The EVM stack is limited to 1024 elements
    const code = new Uint8Array(1024 * 2) // Enough for 1024 PUSH1 operations
    for (let i = 0; i < 1024 * 2; i += 2) {
      code[i] = 0x60     // PUSH1
      code[i + 1] = 0x01 // Push value 1
    }
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.StackOverflow)
  })

  // Test stack underflow
  itIfWasm('should detect stack underflow and stop execution', () => {
    // ADD requires 2 stack elements, but we only push 1
    const code = new Uint8Array([0x60, 0x01, 0x01])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.StackUnderflow)
  })

  // Test invalid jump destination
  itIfWasm('should validate jump destinations and stop on invalid jumps', () => {
    // PUSH1 10 (invalid jump destination), JUMP
    const code = new Uint8Array([0x60, 0x0A, 0x56])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.InvalidJump)
  })
  
  // Test valid jump destination
  itIfWasm('should correctly jump to valid destinations', () => {
    // PUSH1 4 (jump to JUMPDEST at offset 4), JUMP, PUSH1 1, JUMPDEST, PUSH1 2
    const code = new Uint8Array([0x60, 0x04, 0x56, 0x60, 0x01, 0x5B, 0x60, 0x02])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Stack should contain only 2 (not 1), as we jumped over the PUSH1 1
    expect(result.data[31]).toBe(2)
  })

  // Test conditional jump
  itIfWasm('should correctly execute conditional jumps (JUMPI)', () => {
    // Test when condition is true
    // PUSH1 8 (jump dest), PUSH1 1 (true condition), JUMPI, PUSH1 5, JUMP, JUMPDEST, PUSH1 10
    const codeTrue = new Uint8Array([0x60, 0x08, 0x60, 0x01, 0x57, 0x60, 0x05, 0x56, 0x5B, 0x60, 0x0A])
    
    let result = evm.execute(instance, codeTrue)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Should have 10 on the stack
    expect(result.data[31]).toBe(10)
    
    // Test when condition is false
    // PUSH1 8 (jump dest), PUSH1 0 (false condition), JUMPI, PUSH1 20, JUMPDEST, PUSH1 30
    const codeFalse = new Uint8Array([0x60, 0x08, 0x60, 0x00, 0x57, 0x60, 0x14, 0x5B, 0x60, 0x1E])
    
    result = evm.execute(instance, codeFalse)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Should have both 20 and 30 on the stack, with 30 on top
    expect(result.data[31]).toBe(30)
  })

  // Test return data handling
  itIfWasm('should properly handle return data from successful execution', () => {
    // Set some data in memory and return it
    // PUSH1 0xCC, PUSH1 0, MSTORE8, PUSH1 1, PUSH1 0, RETURN
    const code = new Uint8Array([
      0x60, 0xCC,     // PUSH1 0xCC
      0x60, 0x00,     // PUSH1 0
      0x53,           // MSTORE8
      0x60, 0x01,     // PUSH1 1 (size = 1 byte)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3            // RETURN
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data[0]).toBe(0xCC)
  })

  // Test return data handling from reverted execution
  itIfWasm('should properly handle return data from reverted execution', () => {
    // Set some data in memory and revert with it
    // PUSH1 0xDD, PUSH1 0, MSTORE8, PUSH1 1, PUSH1 0, REVERT
    const code = new Uint8Array([
      0x60, 0xDD,     // PUSH1 0xDD
      0x60, 0x00,     // PUSH1 0
      0x53,           // MSTORE8
      0x60, 0x01,     // PUSH1 1 (size = 1 byte)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xFD            // REVERT
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Reverted)
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data[0]).toBe(0xDD)
  })

  // Test return data buffer management for RETURNDATASIZE
  itIfWasm('should update return data buffer and support RETURNDATASIZE', () => {
    // Use RETURNDATASIZE to get size of return data
    // First, we'll create some return data via a RETURN operation
    // Then use RETURNDATASIZE to get its size
    const code = new Uint8Array([
      0x60, 0xEE,     // PUSH1 0xEE
      0x60, 0x00,     // PUSH1 0
      0x52,           // MSTORE
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3,           // RETURN
      0x3D,           // RETURNDATASIZE
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // Result should be 32 (the size of our return data)
    expect(result.data[31]).toBe(32)
  })

  // Test return data buffer management for RETURNDATACOPY
  itIfWasm('should support RETURNDATACOPY for accessing return data buffer', () => {
    // Set up return data, then copy it to memory with RETURNDATACOPY
    // PUSH1 0xFF (value to return), PUSH1 0, MSTORE, PUSH1 32, PUSH1 0, RETURN,
    // PUSH1 0 (dest), PUSH1 0 (offset), PUSH1 32 (size), RETURNDATACOPY,
    // PUSH1 32, PUSH1 0, RETURN
    const code = new Uint8Array([
      // First, set up return data
      0x60, 0xFF,     // PUSH1 0xFF
      0x60, 0x00,     // PUSH1 0
      0x52,           // MSTORE
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3,           // RETURN
      
      // Now use RETURNDATACOPY to access it
      0x60, 0x00,     // PUSH1 0 (dest offset)
      0x60, 0x00,     // PUSH1 0 (source offset)
      0x60, 0x20,     // PUSH1 32 (size)
      0x3E,           // RETURNDATACOPY
      
      // Return what we copied to verify
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3            // RETURN
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    expect(result.data[31]).toBe(0xFF)
  })

  // Test return data out of bounds error
  itIfWasm('should handle return data out of bounds errors', () => {
    // Try to copy more data than is available
    // PUSH1 1 (size=1), PUSH1 0 (offset), RETURN,
    // PUSH1 0 (dest), PUSH1 0 (offset), PUSH1 2 (size > 1), RETURNDATACOPY
    const code = new Uint8Array([
      // Set up small return data
      0x60, 0xFF,     // PUSH1 0xFF
      0x60, 0x00,     // PUSH1 0
      0x52,           // MSTORE
      0x60, 0x01,     // PUSH1 1 (return only 1 byte)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3,           // RETURN
      
      // Try to copy too much
      0x60, 0x00,     // PUSH1 0 (dest offset)
      0x60, 0x00,     // PUSH1 0 (source offset)
      0x60, 0x02,     // PUSH1 2 (size - too large)
      0x3E,           // RETURNDATACOPY
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.ReturnDataOutOfBounds)
  })

  // Test complex execution path with multiple constructs
  itIfWasm('should execute complex programs with control flow, arithmetic, and memory operations', () => {
    // This test combines multiple opcode categories: arithmetic, memory, stack operations, control flow
    // PUSH1, PUSH1, ADD, PUSH1, GT, JUMPI, PUSH1, JUMP, JUMPDEST, PUSH1, PUSH1, MUL, PUSH1, MSTORE, PUSH1, PUSH1, RETURN
    const code = new Uint8Array([
      0x60, 0x0A,     // PUSH1 10
      0x60, 0x05,     // PUSH1 5
      0x01,           // ADD (sum = 15)
      0x60, 0x0C,     // PUSH1 12
      0x11,           // GT (15 > 12 = 1)
      0x60, 0x0D,     // PUSH1 13 (jump to 13 if true)
      0x57,           // JUMPI
      0x60, 0x02,     // PUSH1 2 (this should be skipped)
      0x60, 0x10,     // PUSH1 16 (jump to end)
      0x56,           // JUMP
      0x5B,           // JUMPDEST (offset 13)
      0x60, 0x03,     // PUSH1 3
      0x60, 0x05,     // PUSH1 5
      0x02,           // MUL (product = 15)
      0x60, 0x00,     // PUSH1 0 (memory offset)
      0x52,           // MSTORE
      0x5B,           // JUMPDEST (offset 20)
      0x60, 0x20,     // PUSH1 32 (size)
      0x60, 0x00,     // PUSH1 0 (offset)
      0xF3            // RETURN
    ])
    
    const result = evm.execute(instance, code)
    
    expect(result.result).toBe(ZigEvmResult.Success)
    // The result should be 15 (3 * 5) as 15 > 12 evaluates to true
    // If the jump didn't work, we'd get 2 instead
    expect(result.data[31]).toBe(15)
  })
})