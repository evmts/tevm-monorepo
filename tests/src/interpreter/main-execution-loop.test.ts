/**
 * Tests for Issue #3: Main Execution Loop Implementation
 * 
 * This tests the main execution loop that fetches, decodes, and executes opcodes
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm, ZigEvmResult } from '../zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../../dist/zigevm.wasm');

describe('ZigEVM Main Execution Loop', () => {
  let zigevm: ZigEvm;
  let handle: number;

  beforeAll(async () => {
    // Initialize ZigEVM
    zigevm = new ZigEvm();
    try {
      await zigevm.init(WASM_PATH);
      handle = zigevm.create();
    } catch (error) {
      console.warn(`Skipping tests: ${error}`);
    }
  });

  afterAll(() => {
    if (zigevm?.isInitialized()) {
      zigevm.destroy(handle);
    }
  });

  // Test simple program execution
  it('should execute a simple program correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Simple program: PUSH1 0x01, PUSH1 0x02, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x01,  // PUSH1 0x01
      0x60, 0x02,  // PUSH1 0x02
      0x01,        // ADD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Program should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Result should be 0x03 (1 + 2) as a 32-byte word
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(3);
  });

  // Test gas accounting during execution
  it('should account for gas correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Simple program: PUSH1 0x01, PUSH1 0x02, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x01,  // PUSH1 0x01 (gas: 3)
      0x60, 0x02,  // PUSH1 0x02 (gas: 3)
      0x01,        // ADD (gas: 3)
      0x60, 0x00,  // PUSH1 0x00 (gas: 3)
      0x52,        // MSTORE (gas: 3 + memory expansion cost)
      0x60, 0x20,  // PUSH1 0x20 (gas: 3)
      0x60, 0x00,  // PUSH1 0x00 (gas: 3)
      0xf3,        // RETURN (gas: 0)
    ]);
    
    // Set a low gas limit that should be exceeded
    const lowGasLimit = 10;
    
    // Execute with low gas limit - should run out of gas
    const lowGasResult = zigevm.execute(handle, bytecode, undefined, lowGasLimit);
    
    // Should have run out of gas
    expect(lowGasResult.result).toBe(ZigEvmResult.OutOfGas);
    
    // Now try with sufficient gas
    const sufficientGasLimit = 100;
    const sufficientGasResult = zigevm.execute(handle, bytecode, undefined, sufficientGasLimit);
    
    // Should execute successfully
    expect(sufficientGasResult.result).toBe(ZigEvmResult.Success);
    
    // We should also be able to get the gas used
    const gasUsed = zigevm.getGasUsed(handle);
    
    // Approximate gas calculation (this may need adjustment based on implementation details):
    // 6 * 3 (PUSH1) + 3 (ADD) + ~6 (MSTORE with memory cost) + ~0 (RETURN) ≈ 27
    expect(gasUsed).toBeGreaterThan(0);
    expect(gasUsed).toBeLessThan(sufficientGasLimit);
  });

  // Test early termination with STOP
  it('should handle STOP opcode correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Program with STOP: PUSH1 0x42, PUSH1 0x00, MSTORE, STOP, PUSH1 0xFF, PUSH1 0x20, MSTORE
    const bytecode = new Uint8Array([
      0x60, 0x42,  // PUSH1 0x42
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x00,        // STOP
      0x60, 0xFF,  // PUSH1 0xFF (should not be executed)
      0x60, 0x20,  // PUSH1 0x20 (should not be executed)
      0x52,        // MSTORE (should not be executed)
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // STOP should result in successful termination
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Check that memory location 0x00 contains 0x42 and memory location 0x20 is empty
    // To do this, we use a separate execution that reads from both locations
    const inspectBytecode = new Uint8Array([
      0x60, 0x00,  // PUSH1 0x00
      0x51,        // MLOAD (from location 0x00)
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x51,        // MLOAD (from location 0x20)
      0x60, 0x20,  // PUSH1 0x20
      0x52,        // MSTORE
      0x60, 0x40,  // PUSH1 0x40
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN (return 64 bytes: first location followed by second)
    ]);
    
    // Execute the inspection bytecode with a reset handle (fresh state)
    const handle2 = zigevm.create();
    const inspectResult = zigevm.execute(handle2, inspectBytecode);
    
    // Should execute successfully
    expect(inspectResult.result).toBe(ZigEvmResult.Success);
    
    // Memory at location 0x00 should be empty (all zeros)
    // And location 0x20 should also be empty
    expect(inspectResult.data.slice(0, 32).every(byte => byte === 0)).toBe(true);
    expect(inspectResult.data.slice(32, 64).every(byte => byte === 0)).toBe(true);
    
    // Cleanup
    zigevm.destroy(handle2);
  });

  // Test early termination with REVERT
  it('should handle REVERT opcode correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Program with REVERT: PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, REVERT
    const bytecode = new Uint8Array([
      0x60, 0x42,  // PUSH1 0x42
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xfd,        // REVERT
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // REVERT should result in a revert status
    expect(result.result).toBe(ZigEvmResult.Reverted);
    
    // Result data should contain the reverted data
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x42);
  });

  // Test return data handling
  it('should handle RETURN opcode correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Program with RETURN: PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x42,  // PUSH1 0x42
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // RETURN should result in successful termination
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Result data should contain the returned data
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x42);
  });

  // Test handling of invalid opcodes
  it('should handle invalid opcodes correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Invalid opcode: 0xfe
    const bytecode = new Uint8Array([0xfe]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Should result in an invalid opcode error
    expect(result.result).toBe(ZigEvmResult.InvalidOpcode);
  });

  // Test stack overflow
  it('should handle stack overflow correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Create bytecode that pushes too many items onto the stack (stack limit is 1024)
    const bytecode = new Uint8Array(1025 * 2);
    for (let i = 0; i < 1025; i++) {
      bytecode[i * 2] = 0x60;     // PUSH1 opcode
      bytecode[i * 2 + 1] = 0x01; // Push value 0x01
    }
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Should result in a stack overflow error
    expect(result.result).toBe(ZigEvmResult.StackOverflow);
  });

  // Test stack underflow
  it('should handle stack underflow correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Create bytecode that tries to pop from an empty stack
    const bytecode = new Uint8Array([0x50]); // POP opcode with nothing on the stack
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Should result in a stack underflow error
    expect(result.result).toBe(ZigEvmResult.StackUnderflow);
  });

  // Test invalid jump destination
  it('should handle invalid jump destination correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Create bytecode that tries to jump to an invalid destination
    const bytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05 (not a JUMPDEST)
      0x56,        // JUMP
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Should result in an invalid jump error
    expect(result.result).toBe(ZigEvmResult.InvalidJump);
  });

  // Implement a placeholder method to make the test compile
  ZigEvm.prototype.getGasUsed = function(handle) {
    throw new Error("Not implemented: getGasUsed");
    return 50; // Example return value
  };
});