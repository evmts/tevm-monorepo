/**
 * Return data operations benchmarks for ZigEVM
 * 
 * This file contains benchmarks for testing the RETURNDATASIZE and RETURNDATACOPY
 * opcodes in the ZigEVM implementation.
 */
import { describe, bench, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Placeholder EVM implementations - same as in instructions.bench.ts
interface Interpreter {
  execute(bytecode: Uint8Array, gasLimit: number): ExecutionResult;
}

interface ExecutionResult {
  success: boolean;
  gasUsed: number;
  returnData?: Uint8Array;
}

class ZigEVM {
  private interpreter?: Interpreter;
  private ready: boolean = false;
  
  async initialize(): Promise<void> {
    // In the future, this would initialize the ZigEVM WASM module
    this.ready = true;
    this.interpreter = {
      execute(bytecode: Uint8Array, gasLimit: number): ExecutionResult {
        // Placeholder that will be implemented by the Zig WASM module
        throw new Error("ZigEVM execution not yet implemented");
      }
    };
  }
  
  isReady(): boolean {
    return this.ready;
  }
  
  execute(bytecode: Uint8Array, gasLimit: number = 100000): ExecutionResult {
    if (!this.ready || !this.interpreter) {
      throw new Error("ZigEVM not initialized");
    }
    return this.interpreter.execute(bytecode, gasLimit);
  }
}

class MockEvmOne {
  execute(bytecode: Uint8Array, gasLimit: number = 100000): ExecutionResult {
    return {
      success: true,
      gasUsed: bytecode.length * 3, // Fake gas calculation
    };
  }
}

class MockRevm {
  execute(bytecode: Uint8Array, gasLimit: number = 100000): ExecutionResult {
    return {
      success: true, 
      gasUsed: bytecode.length * 4, // Fake gas calculation
    };
  }
}

/**
 * Creates a test contract that returns some fixed data
 * @param returnData The data to return
 * @returns Contract bytecode
 */
function createReturningContract(returnData: Uint8Array): Uint8Array {
  const bytecode = [
    // Store the data in memory
    ...Array.from(returnData).flatMap((value, index) => [
      0x60, value,             // PUSH1 [value]
      0x60, index,             // PUSH1 [index]
      0x53,                    // MSTORE8
    ]),
    
    // Return the data
    0x60, returnData.length,   // PUSH1 [size]
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0xF3,                      // RETURN
  ];
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a test contract that calls another contract and uses return data
 * @param target Contract address to call (for testing, can be any small number)
 * @returns Contract bytecode
 */
function createCallerContract(target: number = 0x01): Uint8Array {
  const bytecode = [
    // Setup call parameters (simplified call)
    0x60, 0x00,                // PUSH1 0 (return data size - let it be dynamic)
    0x60, 0x00,                // PUSH1 0 (return data memory offset)
    0x60, 0x00,                // PUSH1 0 (input size)
    0x60, 0x00,                // PUSH1 0 (input memory offset)
    0x60, 0x00,                // PUSH1 0 (value)
    0x60, target,              // PUSH1 [target address]
    0x60, 0xFF,                // PUSH1 255 (gas)
    0xF1,                      // CALL
    
    // After call returns, use RETURNDATASIZE
    0x3D,                      // RETURNDATASIZE
    
    // Make a copy of the return data to memory
    0x3D,                      // RETURNDATASIZE (for size)
    0x60, 0x00,                // PUSH1 0 (return data offset)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0x3E,                      // RETURNDATACOPY
    
    // Return the copied data
    0x3D,                      // RETURNDATASIZE
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0xF3,                      // RETURN
  ];
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a test contract that makes a call that reverts with data
 * @returns Contract bytecode
 */
function createRevertingCallTest(): Uint8Array {
  const bytecode = [
    // First create a contract that reverts with some data
    // For simplicity, we'll just use a hardcoded address and assume it will revert
    
    // Setup call parameters
    0x60, 0x00,                // PUSH1 0 (return data size)
    0x60, 0x00,                // PUSH1 0 (return data memory offset)
    0x60, 0x00,                // PUSH1 0 (input size)
    0x60, 0x00,                // PUSH1 0 (input memory offset)
    0x60, 0x00,                // PUSH1 0 (value)
    0x60, 0x02,                // PUSH1 2 (target - some invalid address that would revert)
    0x60, 0xFF,                // PUSH1 255 (gas)
    0xF1,                      // CALL
    
    // After call returns (should fail), use RETURNDATASIZE to see if we got revert data
    0x3D,                      // RETURNDATASIZE
    
    // Use RETURNDATACOPY to copy the revert data to memory
    0x60, 0x20,                // PUSH1 32 (copy up to 32 bytes)
    0x60, 0x00,                // PUSH1 0 (return data offset)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0x3E,                      // RETURNDATACOPY
    
    // Return the copied data
    0x60, 0x20,                // PUSH1 32 (size)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0xF3,                      // RETURN
  ];
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a test contract that tries to perform an out-of-bounds RETURNDATACOPY
 * @returns Contract bytecode
 */
function createOutOfBoundsTest(): Uint8Array {
  const bytecode = [
    // Make a simple call that returns a small amount of data
    0x60, 0x00,                // PUSH1 0 (return data size)
    0x60, 0x00,                // PUSH1 0 (return data memory offset)
    0x60, 0x00,                // PUSH1 0 (input size)
    0x60, 0x00,                // PUSH1 0 (input memory offset)
    0x60, 0x00,                // PUSH1 0 (value)
    0x60, 0x01,                // PUSH1 1 (target - valid address)
    0x60, 0xFF,                // PUSH1 255 (gas)
    0xF1,                      // CALL
    
    // Try to copy more data than is available
    0x60, 0x40,                // PUSH1 64 (size - more than available)
    0x60, 0x00,                // PUSH1 0 (return data offset)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0x3E,                      // RETURNDATACOPY (should fail)
    
    // This should not be reached if the operation fails correctly
    0x60, 0x01,                // PUSH1 1 (success marker)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0x52,                      // MSTORE
    0x60, 0x20,                // PUSH1 32 (size)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0xF3,                      // RETURN
  ];
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a test contract that makes multiple calls and checks that return data changes
 * @returns Contract bytecode
 */
function createMultipleCallsTest(): Uint8Array {
  const bytecode = [
    // First call returning some data
    0x60, 0x00,                // PUSH1 0 (return data size)
    0x60, 0x00,                // PUSH1 0 (return data memory offset)
    0x60, 0x00,                // PUSH1 0 (input size)
    0x60, 0x00,                // PUSH1 0 (input memory offset)
    0x60, 0x00,                // PUSH1 0 (value)
    0x60, 0x01,                // PUSH1 1 (first target)
    0x60, 0xFF,                // PUSH1 255 (gas)
    0xF1,                      // CALL
    
    // Store returndatasize from first call
    0x3D,                      // RETURNDATASIZE
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0x52,                      // MSTORE
    
    // Second call with different return data
    0x60, 0x00,                // PUSH1 0 (return data size)
    0x60, 0x00,                // PUSH1 0 (return data memory offset)
    0x60, 0x00,                // PUSH1 0 (input size)
    0x60, 0x00,                // PUSH1 0 (input memory offset)
    0x60, 0x00,                // PUSH1 0 (value)
    0x60, 0x02,                // PUSH1 2 (second target)
    0x60, 0xFF,                // PUSH1 255 (gas)
    0xF1,                      // CALL
    
    // Store returndatasize from second call
    0x3D,                      // RETURNDATASIZE
    0x60, 0x20,                // PUSH1 32 (memory offset)
    0x52,                      // MSTORE
    
    // Return both stored sizes for comparison
    0x60, 0x40,                // PUSH1 64 (size - 2 words)
    0x60, 0x00,                // PUSH1 0 (memory offset)
    0xF3,                      // RETURN
  ];
  
  return new Uint8Array(bytecode);
}

// Initialize EVM instances
let zigEVM: ZigEVM;
let evmOne: MockEvmOne;
let revm: MockRevm;

beforeAll(async () => {
  // Initialize all EVM implementations
  zigEVM = new ZigEVM();
  await zigEVM.initialize();
  
  evmOne = new MockEvmOne();
  revm = new MockRevm();
});

// Basic RETURNDATASIZE/RETURNDATACOPY benchmark
describe('Return Data Operations', () => {
  const basicCallerCode = createCallerContract();
  
  bench('ZigEVM: Basic RETURNDATASIZE/RETURNDATACOPY', () => {
    try {
      zigEVM.execute(basicCallerCode);
    } catch (e) {
      // Expected to fail until implemented
    }
  });
  
  bench('EvmOne: Basic RETURNDATASIZE/RETURNDATACOPY', () => {
    evmOne.execute(basicCallerCode);
  });
  
  bench('Revm: Basic RETURNDATASIZE/RETURNDATACOPY', () => {
    revm.execute(basicCallerCode);
  });
});

// Revert case
describe('Return Data from Reverts', () => {
  const revertingCode = createRevertingCallTest();
  
  bench('ZigEVM: Return Data from Reverts', () => {
    try {
      zigEVM.execute(revertingCode);
    } catch (e) {
      // Expected to fail until implemented
    }
  });
  
  bench('EvmOne: Return Data from Reverts', () => {
    evmOne.execute(revertingCode);
  });
  
  bench('Revm: Return Data from Reverts', () => {
    revm.execute(revertingCode);
  });
});

// Out of bounds case
describe('Return Data Out-of-Bounds', () => {
  const outOfBoundsCode = createOutOfBoundsTest();
  
  bench('ZigEVM: Return Data Out-of-Bounds', () => {
    try {
      zigEVM.execute(outOfBoundsCode);
    } catch (e) {
      // Expected to fail until implemented
    }
  });
  
  bench('EvmOne: Return Data Out-of-Bounds', () => {
    evmOne.execute(outOfBoundsCode);
  });
  
  bench('Revm: Return Data Out-of-Bounds', () => {
    revm.execute(outOfBoundsCode);
  });
});

// Multiple calls case
describe('Return Data Multiple Calls', () => {
  const multipleCallsCode = createMultipleCallsTest();
  
  bench('ZigEVM: Return Data Multiple Calls', () => {
    try {
      zigEVM.execute(multipleCallsCode);
    } catch (e) {
      // Expected to fail until implemented
    }
  });
  
  bench('EvmOne: Return Data Multiple Calls', () => {
    evmOne.execute(multipleCallsCode);
  });
  
  bench('Revm: Return Data Multiple Calls', () => {
    revm.execute(multipleCallsCode);
  });
});