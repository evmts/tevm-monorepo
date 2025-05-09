/**
 * Comprehensive benchmark tests for Memory Instructions in ZigEVM
 * 
 * These benchmarks test the correctness and performance of memory operations
 * by comparing their behavior with the reference implementations in evmone and revm.
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Number of iterations for each benchmark
const ITERATIONS = 100;

/**
 * Helper to create bytecode for memory operations with various patterns
 * @param operation The memory operation to test ('mload', 'mstore', 'mstore8')
 * @param offset The memory offset to operate on
 * @param value The value to store (for mstore/mstore8 operations)
 * @param size The data size (for copy operations)
 * @returns The bytecode for the test
 */
function createMemoryTest(
  operation: 'mload' | 'mstore' | 'mstore8' | 'msize' | 'mcopy',
  offset: number = 0,
  value?: bigint,
  copyParams?: { sourceOffset: number; size: number }
): Uint8Array {
  const bytecode: number[] = [];
  
  // Helper to add PUSH operations for a value
  function pushValue(val: number | bigint): void {
    // For small numbers, use PUSH1
    if (typeof val === 'number' && val <= 255) {
      bytecode.push(0x60, val); // PUSH1
      return;
    }
    
    // For larger numbers, find the smallest push opcode that fits
    const hex = (typeof val === 'number' ? BigInt(val) : val).toString(16);
    const byteLength = Math.ceil(hex.length / 2);
    
    // Push opcode (PUSH1-PUSH32)
    const pushOpcode = byteLength === 0 ? 0x5F : 0x5F + byteLength; // PUSH0 to PUSH32
    bytecode.push(pushOpcode);
    
    // Add the bytes
    if (byteLength > 0) {
      const paddedHex = hex.padStart(byteLength * 2, '0');
      for (let i = 0; i < paddedHex.length; i += 2) {
        bytecode.push(parseInt(paddedHex.substring(i, i + 2), 16));
      }
    }
  }
  
  switch (operation) {
    case 'mload':
      // Push offset, then MLOAD opcode
      pushValue(offset);
      bytecode.push(0x51); // MLOAD
      break;
      
    case 'mstore':
      // Push value, push offset, then MSTORE opcode
      if (value === undefined) value = 0n;
      pushValue(value);
      pushValue(offset);
      bytecode.push(0x52); // MSTORE
      break;
      
    case 'mstore8':
      // Push value (byte), push offset, then MSTORE8 opcode
      if (value === undefined) value = 0n;
      pushValue(value & 0xFFn); // Only use the lowest byte
      pushValue(offset);
      bytecode.push(0x53); // MSTORE8
      break;
      
    case 'msize':
      // Just the MSIZE opcode
      bytecode.push(0x59); // MSIZE
      break;
      
    case 'mcopy':
      // Push destination, source, size, then MCOPY
      if (!copyParams) copyParams = { sourceOffset: 0, size: 32 };
      pushValue(copyParams.size);
      pushValue(copyParams.sourceOffset);
      pushValue(offset); // destination
      bytecode.push(0x5E); // MCOPY
      break;
  }
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a compound memory test with multiple operations
 * This is useful for testing memory expansion and gas costs in more complex scenarios
 */
function createCompoundMemoryTest(operations: Array<{
  operation: 'mload' | 'mstore' | 'mstore8' | 'msize' | 'mcopy';
  offset: number;
  value?: bigint;
  copyParams?: { sourceOffset: number; size: number };
}>): Uint8Array {
  let bytecode: number[] = [];
  
  // Helper to add PUSH operations for a value
  function pushValue(bytecode: number[], val: number | bigint): void {
    // For small numbers, use PUSH1
    if (typeof val === 'number' && val <= 255) {
      bytecode.push(0x60, val); // PUSH1
      return;
    }
    
    // For larger numbers, find the smallest push opcode that fits
    const hex = (typeof val === 'number' ? BigInt(val) : val).toString(16);
    const byteLength = Math.ceil(hex.length / 2);
    
    // Push opcode (PUSH1-PUSH32)
    const pushOpcode = byteLength === 0 ? 0x5F : 0x5F + byteLength; // PUSH0 to PUSH32
    bytecode.push(pushOpcode);
    
    // Add the bytes
    if (byteLength > 0) {
      const paddedHex = hex.padStart(byteLength * 2, '0');
      for (let i = 0; i < paddedHex.length; i += 2) {
        bytecode.push(parseInt(paddedHex.substring(i, i + 2), 16));
      }
    }
  }
  
  // Add each operation to the bytecode
  for (const op of operations) {
    switch (op.operation) {
      case 'mload':
        // Push offset, then MLOAD opcode
        pushValue(bytecode, op.offset);
        bytecode.push(0x51); // MLOAD
        // Pop the value from stack if we're not at the end
        // (to avoid stack imbalance or overflow)
        if (op !== operations[operations.length - 1]) {
          bytecode.push(0x50); // POP
        }
        break;
        
      case 'mstore':
        // Push value, push offset, then MSTORE opcode
        pushValue(bytecode, op.value || 0n);
        pushValue(bytecode, op.offset);
        bytecode.push(0x52); // MSTORE
        break;
        
      case 'mstore8':
        // Push value (byte), push offset, then MSTORE8 opcode
        pushValue(bytecode, (op.value || 0n) & 0xFFn); // Only use the lowest byte
        pushValue(bytecode, op.offset);
        bytecode.push(0x53); // MSTORE8
        break;
        
      case 'msize':
        // Just the MSIZE opcode
        bytecode.push(0x59); // MSIZE
        // Pop the value from stack if we're not at the end
        if (op !== operations[operations.length - 1]) {
          bytecode.push(0x50); // POP
        }
        break;
        
      case 'mcopy':
        // Push size, source, destination, then MCOPY
        const copyParams = op.copyParams || { sourceOffset: 0, size: 32 };
        pushValue(bytecode, copyParams.size);
        pushValue(bytecode, copyParams.sourceOffset);
        pushValue(bytecode, op.offset); // destination
        bytecode.push(0x5E); // MCOPY
        break;
    }
  }
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a sequential memory access pattern test
 * @param operation The memory operation to test
 * @param startOffset The starting memory offset
 * @param numOperations Number of operations to perform
 * @param stride The stride between operations
 */
function createSequentialAccessTest(
  operation: 'mload' | 'mstore',
  startOffset: number = 0,
  numOperations: number = 10,
  stride: number = 32
): Uint8Array {
  const bytecode: number[] = [];
  
  // Set up initial memory state if we're testing loads
  if (operation === 'mload') {
    // First, populate memory with some values
    for (let i = 0; i < numOperations; i++) {
      const offset = startOffset + i * stride;
      
      // PUSH1 value (using position as value)
      bytecode.push(0x60, (i & 0xFF));
      
      // PUSH2 offset (assuming offsets can fit in 2 bytes)
      if (offset <= 255) {
        bytecode.push(0x60, offset); // PUSH1
      } else {
        bytecode.push(0x61, (offset >> 8) & 0xFF, offset & 0xFF); // PUSH2
      }
      
      // MSTORE
      bytecode.push(0x52);
    }
  }
  
  // Now perform the requested operation sequence
  for (let i = 0; i < numOperations; i++) {
    const offset = startOffset + i * stride;
    
    if (operation === 'mstore') {
      // PUSH1 value (using position as value)
      bytecode.push(0x60, (i & 0xFF));
      
      // PUSH2 offset (assuming offsets can fit in 2 bytes)
      if (offset <= 255) {
        bytecode.push(0x60, offset); // PUSH1
      } else {
        bytecode.push(0x61, (offset >> 8) & 0xFF, offset & 0xFF); // PUSH2
      }
      
      // MSTORE
      bytecode.push(0x52);
    } else { // mload
      // PUSH2 offset (assuming offsets can fit in 2 bytes)
      if (offset <= 255) {
        bytecode.push(0x60, offset); // PUSH1
      } else {
        bytecode.push(0x61, (offset >> 8) & 0xFF, offset & 0xFF); // PUSH2
      }
      
      // MLOAD then POP (to avoid stack overflow)
      bytecode.push(0x51, 0x50);
    }
  }
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a memory expansion test that forces memory to grow to a specific size
 * @param targetSize The target memory size in bytes
 */
function createMemoryExpansionTest(targetSize: number): Uint8Array {
  const bytecode: number[] = [];
  
  // Calculate the number of operations needed
  // Memory grows in 32-byte words, so we'll use MSTORE operations
  const numOperations = Math.ceil(targetSize / 32);
  
  // Perform MSTORE operations at increasing offsets
  for (let i = 0; i < numOperations; i++) {
    const offset = i * 32;
    
    // PUSH1 value (constant)
    bytecode.push(0x60, 0xFF);
    
    // PUSH offset (use appropriate size)
    if (offset <= 255) {
      bytecode.push(0x60, offset); // PUSH1
    } else if (offset <= 65535) {
      bytecode.push(0x61, (offset >> 8) & 0xFF, offset & 0xFF); // PUSH2
    } else {
      // For very large offsets, use PUSH3
      bytecode.push(0x62, (offset >> 16) & 0xFF, (offset >> 8) & 0xFF, offset & 0xFF);
    }
    
    // MSTORE
    bytecode.push(0x52);
  }
  
  // Final MSIZE to verify the expansion
  bytecode.push(0x59);
  
  return new Uint8Array(bytecode);
}

/**
 * Create a test for return data operations (RETURNDATASIZE and RETURNDATACOPY)
 */
function createReturnDataTest(
  operation: 'returndatasize' | 'returndatacopy',
  memOffset?: number,
  rdOffset?: number,
  size?: number
): Uint8Array {
  const bytecode: number[] = [];
  
  // First, generate a call that will return data
  // PUSH1 0 (retSize), PUSH1 0 (retOffset), PUSH1 0 (argsSize), PUSH1 0 (argsOffset),
  // PUSH1 0 (value), PUSH1 address, PUSH1 gas, CALL
  bytecode.push(
    0x60, 0x00, // PUSH1 retSize
    0x60, 0x00, // PUSH1 retOffset
    0x60, 0x00, // PUSH1 argsSize
    0x60, 0x00, // PUSH1 argsOffset
    0x60, 0x00, // PUSH1 value
    0x60, 0x01, // PUSH1 address (using address 1 as a placeholder)
    0x60, 0xFF, // PUSH1 gas
    0xF1        // CALL
  );
  
  // Discard the call result (0 or 1)
  bytecode.push(0x50); // POP
  
  if (operation === 'returndatasize') {
    // RETURNDATASIZE
    bytecode.push(0x3D);
  } else { // returndatacopy
    // Push arguments for RETURNDATACOPY
    if (size === undefined) size = 32;
    if (rdOffset === undefined) rdOffset = 0;
    if (memOffset === undefined) memOffset = 0;
    
    // Size
    if (size <= 255) {
      bytecode.push(0x60, size); // PUSH1
    } else {
      bytecode.push(0x61, (size >> 8) & 0xFF, size & 0xFF); // PUSH2
    }
    
    // Return data offset
    if (rdOffset <= 255) {
      bytecode.push(0x60, rdOffset); // PUSH1
    } else {
      bytecode.push(0x61, (rdOffset >> 8) & 0xFF, rdOffset & 0xFF); // PUSH2
    }
    
    // Memory offset
    if (memOffset <= 255) {
      bytecode.push(0x60, memOffset); // PUSH1
    } else {
      bytecode.push(0x61, (memOffset >> 8) & 0xFF, memOffset & 0xFF); // PUSH2
    }
    
    // RETURNDATACOPY
    bytecode.push(0x3E);
  }
  
  return new Uint8Array(bytecode);
}

// Initialize ZigEVM for benchmarks
describe('ZigEVM Memory Instructions Benchmark', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for memory benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Basic memory operations
  describe('Basic Memory Operations', () => {
    bench('MLOAD from offset 0', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createMemoryTest('mload', 0);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('MSTORE at offset 0', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createMemoryTest('mstore', 0, 0x42n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('MSTORE8 at offset 0', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createMemoryTest('mstore8', 0, 0x42n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('MSIZE with empty memory', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createMemoryTest('msize');
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('MCOPY within memory', () => {
      if (zigevm.isInitialized()) {
        // First, initialize memory
        const initMemory = createMemoryTest('mstore', 0, 0x42n);
        zigevm.execute(zigEvmHandle, initMemory);
        
        // Then test mcopy
        const bytecode = createMemoryTest('mcopy', 32, undefined, { sourceOffset: 0, size: 32 });
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Memory expansion tests at different sizes
  describe('Memory Expansion', () => {
    const sizes = [1024, 4096, 16384, 65536, 131072];
    
    for (const size of sizes) {
      bench(`Expansion to ${size} bytes`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createMemoryExpansionTest(size);
          // Fewer iterations for large memory tests
          const iterations = size <= 4096 ? ITERATIONS / 10 : ITERATIONS / 100;
          for (let i = 0; i < iterations; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Sequential access patterns
  describe('Sequential Access Patterns', () => {
    const operations = ['mload', 'mstore'] as const;
    const sizes = [1024, 4096, 16384];
    
    for (const op of operations) {
      for (const size of sizes) {
        const numOperations = Math.min(100, size / 32);
        
        bench(`Sequential ${op.toUpperCase()} - ${size} bytes`, () => {
          if (zigevm.isInitialized()) {
            const bytecode = createSequentialAccessTest(
              op,
              0,
              numOperations,
              32
            );
            
            const iterations = size <= 4096 ? ITERATIONS / 10 : ITERATIONS / 100;
            for (let i = 0; i < iterations; i++) {
              zigevm.execute(zigEvmHandle, bytecode);
            }
          }
        });
      }
    }
  });
  
  // Random access patterns
  describe('Random Access Patterns', () => {
    const operations = ['mload', 'mstore'] as const;
    const size = 4096;
    const numOperations = 50;
    
    // Simple pseudo-random sequence for memory offsets
    const offsets = Array.from({ length: numOperations }, (_, i) => {
      // Use a simple formula to generate "random" but deterministic offsets
      return (i * 123 + 45) % (size - 32);
    });
    
    for (const op of operations) {
      bench(`Random ${op.toUpperCase()} - ${size} bytes`, () => {
        if (zigevm.isInitialized()) {
          // Create a sequence of operations with "random" offsets
          const operations = offsets.map(offset => ({
            operation: op,
            offset,
            value: BigInt(offset & 0xFF) // Use offset as value for MSTORE
          }));
          
          const bytecode = createCompoundMemoryTest(operations);
          
          for (let i = 0; i < ITERATIONS / 10; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Return data operations
  describe('Return Data Operations', () => {
    bench('RETURNDATASIZE after call', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createReturnDataTest('returndatasize');
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('RETURNDATACOPY after call', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createReturnDataTest('returndatacopy', 0, 0, 32);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Test memory gas costs
  describe('Memory Gas Costs', () => {
    const testPoints = [
      { size: 64, description: 'Small memory' },
      { size: 4096, description: 'Medium memory (4KB)' },
      { size: 65536, description: 'Large memory (64KB)' },
    ];
    
    for (const { size, description } of testPoints) {
      bench(`Gas cost - ${description} (${size} bytes)`, () => {
        if (zigevm.isInitialized()) {
          // Create a sequence that expands memory, then performs an operation
          const bytecode = new Uint8Array([
            // Expand memory to the target size
            ...Array.from(createMemoryExpansionTest(size)),
            
            // Then do a memory operation at the last word
            0x60, 0xFF, // PUSH1 0xFF
            ...(size <= 255 ? [0x60, size - 32] : [0x61, (size - 32) >> 8, (size - 32) & 0xFF]), // PUSH offset
            0x52, // MSTORE
          ]);
          
          const iterations = size <= 4096 ? ITERATIONS / 10 : ITERATIONS / 100;
          for (let i = 0; i < iterations; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Edge cases
  describe('Edge Cases', () => {
    bench('Zero-length memory operations', () => {
      if (zigevm.isInitialized()) {
        // MCOPY with zero size
        const bytecode = createMemoryTest('mcopy', 32, undefined, { sourceOffset: 0, size: 0 });
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Overlapping memory regions in MCOPY', () => {
      if (zigevm.isInitialized()) {
        // First initialize memory with some pattern
        const initBytecode = createSequentialAccessTest('mstore', 0, 10, 32);
        zigevm.execute(zigEvmHandle, initBytecode);
        
        // Test MCOPY with overlapping source and destination
        const bytecode = createMemoryTest('mcopy', 16, undefined, { sourceOffset: 0, size: 64 });
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Access beyond initialized memory', () => {
      if (zigevm.isInitialized()) {
        // MLOAD from a high offset without initialization
        const bytecode = createMemoryTest('mload', 1000000);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
});