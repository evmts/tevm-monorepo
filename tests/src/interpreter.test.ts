/**
 * Tests for ZigEVM main execution loop
 * 
 * These tests verify the correct implementation of the interpreter main execution loop
 * as described in Issue #3 in ISSUES.md.
 * 
 * @see /src/interpreter/interpreter.zig
 */

import { expect, test, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from './zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Helper function to create simple test programs
function createProgram(opcodes: number[]): Uint8Array {
  return new Uint8Array(opcodes);
}

describe('ZigEVM Interpreter Main Execution Loop', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  let initialized = false;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    initialized = true;
  } catch (error) {
    // If WASM isn't built yet, tests will be skipped
    console.warn(`Skipping ZigEVM interpreter tests: ${error}`);
  }
  
  // Helper to execute bytecode and handle errors
  function executeProgram(bytecode: Uint8Array): { 
    success: boolean; 
    gasUsed: number; 
    returnData?: Uint8Array;
    error?: string;
  } {
    if (!initialized) {
      throw new Error("ZigEVM not initialized");
    }
    
    try {
      const result = zigevm.execute(zigEvmHandle, bytecode);
      return {
        success: result.success,
        gasUsed: result.gasUsed,
        returnData: result.returnData,
      };
    } catch (error) {
      return {
        success: false,
        gasUsed: 0,
        error: String(error),
      };
    }
  }
  
  // This test verifies the basic STOP opcode execution
  test.skipIf(!initialized)('Execute simple STOP program', () => {
    // STOP (0x00)
    const bytecode = createProgram([0x00]);
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
    expect(result.returnData?.length).toBe(0);
  });
  
  // This test verifies the execution of simple arithmetic
  test.skipIf(!initialized)('Execute simple arithmetic program', () => {
    // PUSH1 5, PUSH1 10, ADD, STOP
    const bytecode = createProgram([0x60, 0x05, 0x60, 0x0A, 0x01, 0x00]);
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
    
    // In a complete implementation, we would check the stack result
    // Here we're just verifying it executed without errors
  });
  
  // This test verifies the RETURN opcode execution
  test.skipIf(!initialized)('Execute program with RETURN', () => {
    // PUSH1 0xFF (value to store), PUSH1 0 (memory position), MSTORE (store 32 bytes),
    // PUSH1 32 (return size), PUSH1 0 (return offset), RETURN
    const bytecode = createProgram([
      0x60, 0xFF, // PUSH1 0xFF
      0x60, 0x00, // PUSH1 0
      0x52,       // MSTORE
      0x60, 0x20, // PUSH1 32 (size)
      0x60, 0x00, // PUSH1 0 (offset)
      0xF3        // RETURN
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
    expect(result.returnData).toBeDefined();
    
    // The return data should be 32 bytes with 0xFF as the last byte
    expect(result.returnData?.length).toBe(32);
    expect(result.returnData?.[31]).toBe(0xFF);
  });
  
  // This test verifies the REVERT opcode execution
  test.skipIf(!initialized)('Execute program with REVERT', () => {
    // PUSH1 0xFF (value to store), PUSH1 0 (memory position), MSTORE (store 32 bytes),
    // PUSH1 32 (return size), PUSH1 0 (return offset), REVERT
    const bytecode = createProgram([
      0x60, 0xFF, // PUSH1 0xFF
      0x60, 0x00, // PUSH1 0
      0x52,       // MSTORE
      0x60, 0x20, // PUSH1 32 (size)
      0x60, 0x00, // PUSH1 0 (offset)
      0xFD        // REVERT
    ]);
    
    const result = executeProgram(bytecode);
    
    // Revert should be reported as a failure but with return data
    expect(result.success).toBe(false);
    expect(result.gasUsed).toBeGreaterThan(0);
    expect(result.returnData).toBeDefined();
    
    // The return data should be 32 bytes with 0xFF as the last byte
    expect(result.returnData?.length).toBe(32);
    expect(result.returnData?.[31]).toBe(0xFF);
  });
  
  // This test verifies jump execution
  test.skipIf(!initialized)('Execute program with JUMP', () => {
    // PUSH1 0x05 (jump destination), JUMP, INVALID, INVALID, JUMPDEST, PUSH1 0x01, STOP
    const bytecode = createProgram([
      0x60, 0x05, // PUSH1 0x05
      0x56,       // JUMP
      0xFE, 0xFE, // INVALID, INVALID (should be skipped)
      0x5B,       // JUMPDEST
      0x60, 0x01, // PUSH1 0x01
      0x00        // STOP
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
  });
  
  // This test verifies conditional jump execution (taken)
  test.skipIf(!initialized)('Execute program with JUMPI (taken)', () => {
    // PUSH1 0x01 (condition true), PUSH1 0x07 (jump destination), JUMPI, 
    // INVALID, INVALID, JUMPDEST, PUSH1 0x01, STOP
    const bytecode = createProgram([
      0x60, 0x01, // PUSH1 0x01 (condition true)
      0x60, 0x07, // PUSH1 0x07 (jump destination)
      0x57,       // JUMPI
      0xFE, 0xFE, // INVALID, INVALID (should be skipped)
      0x5B,       // JUMPDEST
      0x60, 0x01, // PUSH1 0x01
      0x00        // STOP
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
  });
  
  // This test verifies conditional jump execution (not taken)
  test.skipIf(!initialized)('Execute program with JUMPI (not taken)', () => {
    // PUSH1 0x00 (condition false), PUSH1 0x07 (jump destination), JUMPI,
    // PUSH1 0x01, STOP, JUMPDEST, INVALID
    const bytecode = createProgram([
      0x60, 0x00, // PUSH1 0x00 (condition false)
      0x60, 0x07, // PUSH1 0x07 (jump destination)
      0x57,       // JUMPI
      0x60, 0x01, // PUSH1 0x01 (should be executed)
      0x00,       // STOP
      0x5B,       // JUMPDEST (should not be reached)
      0xFE        // INVALID
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
  });
  
  // This test verifies gas accounting during execution
  test.skipIf(!initialized)('Gas accounting during execution', () => {
    // Create a program that uses a known amount of gas
    // PUSH1 0x01, PUSH1 0x02, ADD, MUL, SUB, DIV, STOP
    const bytecode = createProgram([
      0x60, 0x01, // PUSH1 0x01 (3 gas)
      0x60, 0x02, // PUSH1 0x02 (3 gas)
      0x01,       // ADD (3 gas)
      0x02,       // MUL (5 gas)
      0x03,       // SUB (3 gas)
      0x04,       // DIV (5 gas)
      0x00        // STOP (0 gas)
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
    
    // The gas used should be at least the sum of the operation costs
    // Since this is an incomplete implementation, we can't check exact values
    expect(result.gasUsed).toBeGreaterThanOrEqual(22);
  });
  
  // This test verifies handling of out-of-gas errors
  test.skipIf(!initialized)('Out of gas handling', () => {
    // PUSH1 0x01, PUSH1 0x02, ADD (with low gas limit)
    const bytecode = createProgram([0x60, 0x01, 0x60, 0x02, 0x01]);
    
    // Setting a gas limit that's too low for the program
    const lowGasLimit = 5; // Not enough for the full program
    
    // In a complete implementation, we'd use the gas limit parameter
    // For now, we're just testing the normal execution
    const result = executeProgram(bytecode);
    
    // Since we can't set a specific gas limit yet, this should succeed
    // In the actual implementation, this should fail with out of gas
    expect(result.success).toBe(true);
    
    // Test will be updated once gas limiting is implemented
  });
  
  // This test verifies handling of invalid jump destinations
  test.skipIf(!initialized)('Invalid jump destination handling', () => {
    // PUSH1 0xFF (invalid destination), JUMP
    const bytecode = createProgram([0x60, 0xFF, 0x56]);
    
    const result = executeProgram(bytecode);
    
    // This should fail with an invalid jump destination error
    expect(result.success).toBe(false);
    // Check error message once WASM exposes proper error handling
  });
  
  // This test verifies handling of invalid opcodes
  test.skipIf(!initialized)('Invalid opcode handling', () => {
    // Use an undefined opcode (0xFE is INVALID in EVM)
    const bytecode = createProgram([0xFE]);
    
    const result = executeProgram(bytecode);
    
    // This should fail with an invalid opcode error
    expect(result.success).toBe(false);
    // Check error message once WASM exposes proper error handling
  });
  
  // This test verifies handling of the return data buffer
  test.skipIf(!initialized)('Return data buffer management', () => {
    // First execute a program that returns data
    const returnProgram = createProgram([
      0x60, 0xFF, // PUSH1 0xFF
      0x60, 0x00, // PUSH1 0
      0x52,       // MSTORE
      0x60, 0x20, // PUSH1 32 (size)
      0x60, 0x00, // PUSH1 0 (offset)
      0xF3        // RETURN
    ]);
    
    const returnResult = executeProgram(returnProgram);
    expect(returnResult.success).toBe(true);
    expect(returnResult.returnData?.length).toBe(32);
    
    // Then execute a program using RETURNDATASIZE and RETURNDATACOPY
    // This isn't fully implemented yet, so we're just testing that it executes
    // eventually these opcodes should access the previous call's return data
    const returnDataProgram = createProgram([
      0x3D,       // RETURNDATASIZE
      0x60, 0x00, // PUSH1 0 (memory position to copy to)
      0x60, 0x00, // PUSH1 0 (return data offset)
      0x3E,       // RETURNDATACOPY
      0x00        // STOP
    ]);
    
    // For now, just verify the program executes without crashing
    // The actual functionality will be tested later when fully implemented
    const result = executeProgram(returnDataProgram);
    
    // In the current implementation, this might fail with unimplemented opcode
    // In the final implementation, it should succeed
  });
  
  // This test verifies the execution loop handles a complex program
  test.skipIf(!initialized)('Complex program execution (factorial calculation)', () => {
    // Program to calculate factorial 5 (5!)
    // Uses: counter, accumulator, jumps
    const bytecode = createProgram([
      // Initialize: counter = 5, accumulator = 1
      0x60, 0x05, // PUSH1 5 (counter)
      0x60, 0x01, // PUSH1 1 (accumulator)
      
      // Label: loop
      0x5B,       // JUMPDEST
      
      // Check if counter == 0
      0x80,       // DUP1 (duplicate counter)
      0x60, 0x00, // PUSH1 0
      0x14,       // EQ (counter == 0)
      0x60, 0x1D, // PUSH1 0x1D (end address)
      0x57,       // JUMPI (jump to end if counter == 0)
      
      // Multiply: accumulator *= counter
      0x90,       // SWAP1 (swap accumulator to top)
      0x80,       // DUP1 (duplicate accumulator)
      0x91,       // SWAP2 (swap counter to top)
      0x02,       // MUL (accumulator * counter)
      0x90,       // SWAP1 (put accumulator back in position)
      
      // Decrement counter
      0x60, 0x01, // PUSH1 1
      0x03,       // SUB (counter - 1)
      
      // Jump back to loop
      0x60, 0x02, // PUSH1 0x02 (loop address)
      0x56,       // JUMP
      
      // Label: end
      0x5B,       // JUMPDEST
      0x50,       // POP (remove counter)
      0x00        // STOP
    ]);
    
    const result = executeProgram(bytecode);
    
    expect(result.success).toBe(true);
    expect(result.gasUsed).toBeGreaterThan(0);
    
    // In a complete implementation, we would check the stack result
    // The final stack should contain 120 (factorial of 5)
  });
});