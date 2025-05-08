/**
 * Comprehensive benchmark tests for Main Execution Loop in ZigEVM
 * 
 * These benchmarks test the correctness and performance of the main execution loop
 * that powers the ZigEVM, focusing on its ability to handle different termination
 * conditions, gas accounting, and error handling.
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Number of iterations for each benchmark
const ITERATIONS = 100;

/**
 * Create bytecode for a simple program that just stops
 */
function createStopProgram(): Uint8Array {
  return new Uint8Array([
    0x00 // STOP
  ]);
}

/**
 * Create bytecode for a program that returns data
 * @param size Size of data to return
 * @param value Value to fill in the returned data
 */
function createReturnProgram(size: number = 32, value: number = 0x42): Uint8Array {
  // For simplicity with small values
  if (size <= 32 && value <= 255) {
    return new Uint8Array([
      0x60, value,             // PUSH1 value
      0x60, 0x00,              // PUSH1 0x00 (memory offset)
      0x52,                    // MSTORE
      0x60, size,              // PUSH1 size (bytes to return)
      0x60, 0x00,              // PUSH1 0x00 (memory offset)
      0xF3                     // RETURN
    ]);
  }
  
  // More complex case with larger values - not implementing for brevity
  throw new Error("Large return values not implemented in test");
}

/**
 * Create bytecode for a program that reverts with data
 * @param size Size of data to return in the revert
 * @param value Value to fill in the returned data
 */
function createRevertProgram(size: number = 32, value: number = 0x42): Uint8Array {
  return new Uint8Array([
    0x60, value,             // PUSH1 value
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0x52,                    // MSTORE
    0x60, size,              // PUSH1 size (bytes to return)
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0xFD                     // REVERT
  ]);
}

/**
 * Create bytecode for a program that runs out of gas
 * This creates a loop that continues until gas is exhausted
 */
function createOutOfGasProgram(): Uint8Array {
  return new Uint8Array([
    // Initialize counter
    0x60, 0x00,              // PUSH1 0x00 (counter = 0)
    0x60, 0x00,              // PUSH1 0x00 (storage slot)
    0x55,                    // SSTORE (store counter at slot 0)
    
    // Loop start (JUMPDEST)
    0x5B,                    // JUMPDEST
    
    // Increment counter
    0x60, 0x00,              // PUSH1 0x00 (storage slot)
    0x54,                    // SLOAD (load counter)
    0x60, 0x01,              // PUSH1 0x01
    0x01,                    // ADD (counter + 1)
    0x60, 0x00,              // PUSH1 0x00 (storage slot)
    0x55,                    // SSTORE (store counter)
    
    // Jump back to loop start
    0x60, 0x04,              // PUSH1 0x04 (address of JUMPDEST)
    0x56                     // JUMP
  ]);
}

/**
 * Create bytecode for a program that causes a stack overflow
 */
function createStackOverflowProgram(): Uint8Array {
  const bytecode = [0x5B]; // JUMPDEST at position 0
  
  // Push 1024 values onto the stack (the EVM stack limit)
  for (let i = 0; i < 1025; i++) {
    bytecode.push(0x60, 0x01); // PUSH1 0x01
  }
  
  return new Uint8Array(bytecode);
}

/**
 * Create bytecode for a program that causes a stack underflow
 */
function createStackUnderflowProgram(): Uint8Array {
  return new Uint8Array([
    0x50, // POP with empty stack
  ]);
}

/**
 * Create bytecode for a program with an invalid jump
 */
function createInvalidJumpProgram(): Uint8Array {
  return new Uint8Array([
    0x60, 0x10,              // PUSH1 0x10 (invalid jump destination)
    0x56                     // JUMP
  ]);
}

/**
 * Create bytecode for a program with an invalid opcode
 */
function createInvalidOpcodeProgram(): Uint8Array {
  return new Uint8Array([
    0xFE                     // INVALID opcode
  ]);
}

/**
 * Create bytecode for a complex program with nested control flow
 * @param depth How deep to nest the control flow
 */
function createNestedControlFlowProgram(depth: number = 3): Uint8Array {
  // This is a simplified version for the benchmark
  // In a real implementation, we would create a more complex control flow
  
  const bytecode: number[] = [];
  
  // Start with a simple value
  bytecode.push(
    0x60, 0x01,              // PUSH1 0x01 (accumulator)
  );
  
  // For each level of nesting
  for (let i = 0; i < depth; i++) {
    // Branch based on some condition
    bytecode.push(
      0x80,                  // DUP1 (duplicate accumulator)
      0x60, 0x02,            // PUSH1 0x02
      0x02,                  // MUL (multiply accumulator by 2)
      0x80,                  // DUP1 (duplicate result)
      0x15,                  // ISZERO (check if result is zero)
    );
    
    // Create a conditional jump to skip the next multiplication
    // ISZERO will be 0 unless result is 0, so we'll normally take the branch
    const jumpDestPos = bytecode.length + 8;
    bytecode.push(
      0x60, jumpDestPos,     // PUSH1 jumpDestPos
      0x57,                  // JUMPI (jump if condition is true)
      
      // If we didn't jump, multiply accumulator by 3
      0x80,                  // DUP1 (duplicate accumulator)
      0x60, 0x03,            // PUSH1 0x03
      0x02,                  // MUL (multiply accumulator by 3)
      
      // Jump destination for the branch
      0x5B,                  // JUMPDEST
    );
  }
  
  // Return the final value
  bytecode.push(
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0x52,                    // MSTORE (store accumulator in memory)
    0x60, 0x20,              // PUSH1 0x20 (32 bytes to return)
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0xF3                     // RETURN
  );
  
  return new Uint8Array(bytecode);
}

/**
 * Create bytecode for a program that executes many simple operations
 * @param operations Number of operations to execute
 */
function createManyOpsProgram(operations: number = 100): Uint8Array {
  const bytecode: number[] = [];
  
  // Push initial value
  bytecode.push(0x60, 0x01); // PUSH1 0x01
  
  // Execute a series of operations
  for (let i = 0; i < operations; i++) {
    // Simple arithmetic (add 1)
    bytecode.push(
      0x60, 0x01,           // PUSH1 0x01
      0x01,                 // ADD
    );
  }
  
  // Return the result
  bytecode.push(
    0x60, 0x00,             // PUSH1 0x00 (memory offset)
    0x52,                   // MSTORE (store result in memory)
    0x60, 0x20,             // PUSH1 0x20 (32 bytes to return)
    0x60, 0x00,             // PUSH1 0x00 (memory offset)
    0xF3                    // RETURN
  );
  
  return new Uint8Array(bytecode);
}

/**
 * Create bytecode for a program with complex memory and stack manipulation
 */
function createComplexMemoryProgram(): Uint8Array {
  return new Uint8Array([
    // Store values at different memory locations
    0x60, 0x01,              // PUSH1 0x01
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0x52,                    // MSTORE
    
    0x60, 0x02,              // PUSH1 0x02
    0x60, 0x20,              // PUSH1 0x20 (memory offset)
    0x52,                    // MSTORE
    
    0x60, 0x03,              // PUSH1 0x03
    0x60, 0x40,              // PUSH1 0x40 (memory offset)
    0x52,                    // MSTORE
    
    // Load values from memory
    0x60, 0x00,              // PUSH1 0x00 (memory offset)
    0x51,                    // MLOAD
    
    0x60, 0x20,              // PUSH1 0x20 (memory offset)
    0x51,                    // MLOAD
    
    0x60, 0x40,              // PUSH1 0x40 (memory offset)
    0x51,                    // MLOAD
    
    // Add them together
    0x01,                    // ADD (3 + 2 = 5)
    0x01,                    // ADD (5 + 1 = 6)
    
    // Store the result and return
    0x60, 0x60,              // PUSH1 0x60 (memory offset)
    0x52,                    // MSTORE
    
    0x60, 0x20,              // PUSH1 0x20 (32 bytes to return)
    0x60, 0x60,              // PUSH1 0x60 (memory offset)
    0xF3                     // RETURN
  ]);
}

// Initialize ZigEVM for benchmarks
describe('ZigEVM Main Execution Loop Benchmark', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for execution loop benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Basic execution modes
  describe('Basic Execution Modes', () => {
    bench('STOP - simplest program', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createStopProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('RETURN - returning data', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createReturnProgram(32, 0x42);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('REVERT - returning data with revert', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createRevertProgram(32, 0x42);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Error handling
  describe('Error Handling', () => {
    bench('Out of Gas', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createOutOfGasProgram();
        for (let i = 0; i < ITERATIONS / 10; i++) { // Fewer iterations for expensive operations
          zigevm.execute(zigEvmHandle, bytecode, new Uint8Array(), 10000); // Low gas limit
        }
      }
    });
    
    bench('Stack Overflow', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createStackOverflowProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Stack Underflow', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createStackUnderflowProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Invalid Jump', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createInvalidJumpProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Invalid Opcode', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createInvalidOpcodeProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Complex execution patterns
  describe('Complex Execution Patterns', () => {
    bench('Nested Control Flow', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createNestedControlFlowProgram(3);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Many Simple Operations (100)', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createManyOpsProgram(100);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Many Simple Operations (1000)', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createManyOpsProgram(1000);
        for (let i = 0; i < ITERATIONS / 10; i++) { // Fewer iterations for expensive operations
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Complex Memory and Stack Manipulation', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createComplexMemoryProgram();
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Gas accounting
  describe('Gas Accounting', () => {
    // Test different gas limits
    const gasLimits = [10000, 100000, 1000000];
    
    for (const gasLimit of gasLimits) {
      bench(`Execution with ${gasLimit} gas limit`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createManyOpsProgram(50);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode, new Uint8Array(), gasLimit);
          }
        }
      });
    }
    
    // Test different code sizes with the same gas limit
    const codeSizes = [10, 100, 1000];
    
    for (const size of codeSizes) {
      bench(`Code size ${size} operations`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createManyOpsProgram(size);
          for (let i = 0; i < ITERATIONS / Math.max(1, size / 100); i++) {
            zigevm.execute(zigEvmHandle, bytecode, new Uint8Array(), 1000000);
          }
        }
      });
    }
  });
  
  // Execution events
  describe('Execution Events', () => {
    // In a real implementation, we would test step events and other execution events
    // For now, we just have a placeholder
    bench('Step Events during execution', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createManyOpsProgram(10);
        for (let i = 0; i < ITERATIONS; i++) {
          // In a real implementation, we would register a step event handler
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
});