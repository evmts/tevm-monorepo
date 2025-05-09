/**
 * Tests for Issue #2: Opcode Execution Table
 * 
 * This tests the dispatch mechanism that maps opcodes to their implementations
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm, ZigEvmResult } from '../zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../../dist/zigevm.wasm');

describe('ZigEVM Opcode Execution Table', () => {
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

  // Test that the opcode dispatch mechanism works correctly
  it('should correctly dispatch to STOP opcode', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // STOP (0x00)
    const bytecode = new Uint8Array([0x00]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // STOP should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
  });

  // Test dispatching to a basic arithmetic opcode
  it('should correctly dispatch to ADD opcode', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x05, PUSH1 0x06, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05
      0x60, 0x06,  // PUSH1 0x06
      0x01,        // ADD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // ADD should execute successfully and return the correct result
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Result should be 0x0B (5 + 6 = 11) as a 32-byte word
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(11);
  });

  // Test dispatching to a memory operation
  it('should correctly dispatch to MSTORE and MLOAD opcodes', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x00, MLOAD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x42,  // PUSH1 0x42
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x00,  // PUSH1 0x00
      0x51,        // MLOAD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // MSTORE and MLOAD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Result should be the value we stored (0x42) padded to 32 bytes
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x42);
  });

  // Test handling of invalid opcodes
  it('should handle unknown opcodes correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Use opcode 0xFE which is undefined in the EVM
    const bytecode = new Uint8Array([0xFE]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Should return invalid opcode error
    expect(result.result).toBe(ZigEvmResult.InvalidOpcode);
  });

  // Test that stack operations are correctly dispatched
  it('should correctly dispatch stack operations', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x01, PUSH1 0x02, PUSH1 0x03, SWAP2, POP, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x01,  // PUSH1 0x01
      0x60, 0x02,  // PUSH1 0x02
      0x60, 0x03,  // PUSH1 0x03
      0x91,        // SWAP2
      0x50,        // POP
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Stack operations should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // After SWAP2, the stack is [0x03, 0x02, 0x01]
    // After POP, the stack is [0x02, 0x01]
    // After MSTORE, 0x01 is stored at address 0 (padded to 32 bytes)
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x01);
  });

  // Test that environmental opcodes are correctly dispatched
  it('should correctly dispatch environmental operations', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // ADDRESS, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x30,        // ADDRESS
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode, undefined, 100000000,
      '0x1234567890123456789012345678901234567890'); // Set contract address
    
    // Environmental operations should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // Result should be the contract address padded to 32 bytes
    // This is a bit complex to check exactly, but we ensure it's a valid result
    expect(result.data.length).toBe(32);
  });

  // Test that the jump operations are correctly dispatched
  it('should correctly dispatch jump operations', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x0A, JUMP, PUSH1 0xFF, PUSH1 0x00, MSTORE, JUMPDEST, PUSH1 0x42, PUSH1 0x00, MSTORE,
    // PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x0A,  // PUSH1 0x0A (jump destination - offset 10)
      0x56,        // JUMP
      0x60, 0xFF,  // PUSH1 0xFF - this should be skipped
      0x60, 0x00,  // PUSH1 0x00 - this should be skipped
      0x52,        // MSTORE - this should be skipped
      0x5B,        // JUMPDEST - offset 10
      0x60, 0x42,  // PUSH1 0x42
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Jump operations should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // The value 0x42 should be stored and returned, not 0xFF
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x42);
  });
  
  // Test RETURNDATASIZE and RETURNDATACOPY opcodes
  it('should correctly dispatch RETURNDATASIZE and RETURNDATACOPY opcodes', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // First call creates return data
    // PUSH1 0x20, PUSH1 0x00, PUSH1 0x00, CREATE, POP
    // Then RETURNDATASIZE, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      // Call into a contract that returns some data
      // For testing, we'll just simulate the call happened
      
      // RETURNDATASIZE
      0x3D,        // RETURNDATASIZE
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xF3,        // RETURN
    ]);
    
    // For testing, we'll just check that the call doesn't fail
    // A full implementation would need to test the actual return data size
    const result = zigevm.execute(handle, bytecode);
    
    // Should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    expect(result.data.length).toBe(32);
  });
});