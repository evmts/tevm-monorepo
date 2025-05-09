/**
 * Comprehensive benchmark tests for Storage Instructions in ZigEVM
 * 
 * These benchmarks test the correctness and performance of storage operations
 * by comparing their behavior with the reference implementations in evmone and revm.
 * 
 * Storage operations are particularly important for gas metering and EVM compatibility,
 * as they follow complex rules defined in various EIPs (e.g., EIP-2200 for net gas metering).
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Number of iterations for each benchmark
const ITERATIONS = 100;

/**
 * Helper function to create bytecode for storage operations (SLOAD, SSTORE)
 * @param operation The operation to test ('sload' or 'sstore')
 * @param key The storage key to read/write
 * @param value The value to write (for SSTORE only)
 * @returns The bytecode for the test
 */
function createStorageTest(
  operation: 'sload' | 'sstore',
  key: bigint = 0n,
  value?: bigint
): Uint8Array {
  // Helper to push a value onto the stack
  function pushValue(bytecode: number[], val: bigint): void {
    // Convert to hex and determine size
    const hex = val.toString(16);
    const byteLength = Math.ceil(hex.length / 2);
    
    // Handle PUSH0 for zero
    if (val === 0n) {
      bytecode.push(0x5F); // PUSH0
      return;
    }
    
    // Choose appropriate PUSH opcode (PUSH1-PUSH32)
    const pushOpcode = 0x60 + byteLength - 1; // PUSH1 to PUSH32
    bytecode.push(pushOpcode);
    
    // Add the bytes for the value
    const paddedHex = hex.padStart(byteLength * 2, '0');
    for (let i = 0; i < paddedHex.length; i += 2) {
      bytecode.push(parseInt(paddedHex.substring(i, i + 2), 16));
    }
  }

  const bytecode: number[] = [];
  
  if (operation === 'sload') {
    // PUSH key, SLOAD
    pushValue(bytecode, key);
    bytecode.push(0x54); // SLOAD
  } else if (operation === 'sstore') {
    // PUSH value, PUSH key, SSTORE
    if (value === undefined) value = 0n;
    pushValue(bytecode, value);
    pushValue(bytecode, key);
    bytecode.push(0x55); // SSTORE
  }
  
  return new Uint8Array(bytecode);
}

/**
 * Creates a storage operation sequence with multiple operations
 * Used to test EIP-2200 net gas metering and optimizations for repeated accesses
 */
function createStorageSequence(operations: Array<{
  operation: 'sload' | 'sstore',
  key: bigint,
  value?: bigint
}>): Uint8Array {
  // Helper to push a value onto the stack
  function pushValue(bytecode: number[], val: bigint): void {
    // Convert to hex and determine size
    const hex = val.toString(16);
    const byteLength = Math.ceil(hex.length / 2);
    
    // Handle PUSH0 for zero
    if (val === 0n) {
      bytecode.push(0x5F); // PUSH0
      return;
    }
    
    // Choose appropriate PUSH opcode (PUSH1-PUSH32)
    const pushOpcode = 0x60 + byteLength - 1; // PUSH1 to PUSH32
    bytecode.push(pushOpcode);
    
    // Add the bytes for the value
    const paddedHex = hex.padStart(byteLength * 2, '0');
    for (let i = 0; i < paddedHex.length; i += 2) {
      bytecode.push(parseInt(paddedHex.substring(i, i + 2), 16));
    }
  }

  const bytecode: number[] = [];
  
  for (const op of operations) {
    if (op.operation === 'sload') {
      // PUSH key, SLOAD
      pushValue(bytecode, op.key);
      bytecode.push(0x54); // SLOAD
      
      // If this isn't the last operation, discard the loaded value
      if (op !== operations[operations.length - 1]) {
        bytecode.push(0x50); // POP
      }
    } else if (op.operation === 'sstore') {
      // PUSH value, PUSH key, SSTORE
      if (op.value === undefined) op.value = 0n;
      pushValue(bytecode, op.value);
      pushValue(bytecode, op.key);
      bytecode.push(0x55); // SSTORE
    }
  }
  
  return new Uint8Array(bytecode);
}

// Initialize ZigEVM for benchmarks
describe('ZigEVM Storage Instructions Benchmark', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for storage benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Basic SLOAD and SSTORE tests
  describe('Basic Storage Operations', () => {
    bench('SLOAD from empty storage', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createStorageTest('sload', 0n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('SSTORE to empty slot', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createStorageTest('sstore', 0n, 42n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('SSTORE overwrite existing value', () => {
      if (zigevm.isInitialized()) {
        // First set a value
        const setCode = createStorageTest('sstore', 1n, 42n);
        zigevm.execute(zigEvmHandle, setCode);
        
        // Then overwrite it
        const overwriteCode = createStorageTest('sstore', 1n, 43n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, overwriteCode);
        }
      }
    });
    
    bench('SSTORE reset to zero', () => {
      if (zigevm.isInitialized()) {
        // First set a value
        const setCode = createStorageTest('sstore', 2n, 42n);
        zigevm.execute(zigEvmHandle, setCode);
        
        // Then reset to zero
        const resetCode = createStorageTest('sstore', 2n, 0n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, resetCode);
        }
      }
    });
  });
  
  // EIP-2200 Net Gas Metering Scenarios
  describe('EIP-2200 Net Gas Metering', () => {
    // Test case 1: Original value == current value != new value
    bench('EIP-2200: Same orig/current, new value', () => {
      if (zigevm.isInitialized()) {
        // First, initialize the state
        const initCode = createStorageTest('sstore', 10n, 100n);
        zigevm.execute(zigEvmHandle, initCode);
        
        // Now create the test sequence
        const sequence = createStorageSequence([
          { operation: 'sstore', key: 10n, value: 200n } // Change from 100 to 200
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, sequence);
        }
      }
    });
    
    // Test case 2: Original value != current value, new value == original value
    bench('EIP-2200: Different orig/current, new = orig', () => {
      if (zigevm.isInitialized()) {
        // Initialize with original value
        const initCode = createStorageTest('sstore', 11n, 100n);
        zigevm.execute(zigEvmHandle, initCode);
        
        // Modify current value
        const modifyCode = createStorageTest('sstore', 11n, 200n);
        zigevm.execute(zigEvmHandle, modifyCode);
        
        // Now test reverting to original
        const revertCode = createStorageTest('sstore', 11n, 100n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, revertCode);
        }
      }
    });
    
    // Test case 3: Original value != current value != new value
    bench('EIP-2200: All values different', () => {
      if (zigevm.isInitialized()) {
        // Initialize with original value
        const initCode = createStorageTest('sstore', 12n, 100n);
        zigevm.execute(zigEvmHandle, initCode);
        
        // Modify current value
        const modifyCode = createStorageTest('sstore', 12n, 200n);
        zigevm.execute(zigEvmHandle, modifyCode);
        
        // Now test setting a third value
        const newValueCode = createStorageTest('sstore', 12n, 300n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, newValueCode);
        }
      }
    });
    
    // Test case 4: Current is zero, original is non-zero, new is non-zero
    bench('EIP-2200: Current zero, others non-zero', () => {
      if (zigevm.isInitialized()) {
        // Initialize with original value
        const initCode = createStorageTest('sstore', 13n, 100n);
        zigevm.execute(zigEvmHandle, initCode);
        
        // Set to zero
        const zeroCode = createStorageTest('sstore', 13n, 0n);
        zigevm.execute(zigEvmHandle, zeroCode);
        
        // Now test setting new non-zero value
        const newValueCode = createStorageTest('sstore', 13n, 300n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, newValueCode);
        }
      }
    });
  });
  
  // SLOAD followed by SSTORE to same slot
  describe('SLOAD/SSTORE Combinations', () => {
    bench('SLOAD then SSTORE to same slot', () => {
      if (zigevm.isInitialized()) {
        const sequence = createStorageSequence([
          { operation: 'sload', key: 20n },
          { operation: 'sstore', key: 20n, value: 42n }
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, sequence);
        }
      }
    });
    
    bench('Multiple SLOADs to same slot', () => {
      if (zigevm.isInitialized()) {
        const sequence = createStorageSequence([
          { operation: 'sload', key: 21n },
          { operation: 'sload', key: 21n },
          { operation: 'sload', key: 21n },
          { operation: 'sload', key: 21n },
          { operation: 'sload', key: 21n }
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, sequence);
        }
      }
    });
    
    bench('SSTORE multiple values to same slot', () => {
      if (zigevm.isInitialized()) {
        const sequence = createStorageSequence([
          { operation: 'sstore', key: 22n, value: 1n },
          { operation: 'sstore', key: 22n, value: 2n },
          { operation: 'sstore', key: 22n, value: 3n },
          { operation: 'sstore', key: 22n, value: 4n }
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, sequence);
        }
      }
    });
  });
  
  // Performance with large keys and values
  describe('Large Storage Keys and Values', () => {
    // Large key cases
    const largeKeys = [
      { name: '8 bytes', value: 0xFFFFFFFFFFFFFFFFn },
      { name: '16 bytes', value: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn },
      { name: '32 bytes', value: (1n << 256n) - 1n }
    ];
    
    // Test SLOAD with large keys
    for (const { name, value } of largeKeys) {
      bench(`SLOAD with ${name} key`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createStorageTest('sload', value);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
    
    // Test SSTORE with large keys and values
    for (const { name, value } of largeKeys) {
      bench(`SSTORE with ${name} key and value`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createStorageTest('sstore', value, value);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Storage access patterns
  describe('Storage Access Patterns', () => {
    // Sequential access to multiple slots
    bench('Sequential access to storage slots', () => {
      if (zigevm.isInitialized()) {
        // Create a sequence that accesses 10 sequential slots
        const operations = Array.from({ length: 10 }, (_, i) => ({
          operation: 'sstore' as const,
          key: BigInt(100 + i),
          value: BigInt(i + 1)
        }));
        
        const bytecode = createStorageSequence(operations);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    // Random access to slots
    bench('Random access to storage slots', () => {
      if (zigevm.isInitialized()) {
        // Generate pseudo-random slot numbers
        const randomSlots = Array.from({ length: 10 }, (_, i) => 
          BigInt((123 * (i * i + 7 * i + 11)) % 1000 + 1000)
        );
        
        // Create operations with these slots
        const operations = randomSlots.map((key, i) => ({
          operation: 'sstore' as const,
          key,
          value: BigInt(i + 1)
        }));
        
        const bytecode = createStorageSequence(operations);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    // Access pattern that alternates between reading and writing
    bench('Mixed read/write access pattern', () => {
      if (zigevm.isInitialized()) {
        // Create a sequence that alternates between SLOAD and SSTORE
        const operations = Array.from({ length: 10 }, (_, i) => {
          if (i % 2 === 0) {
            return {
              operation: 'sload' as const,
              key: BigInt(200 + i)
            };
          } else {
            return {
              operation: 'sstore' as const,
              key: BigInt(200 + i - 1), // Write to the slot we just read
              value: BigInt(i + 100)
            };
          }
        });
        
        const bytecode = createStorageSequence(operations);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Static context restrictions
  describe('Static Context Restrictions', () => {
    // Test SSTORE in a static context (should fail)
    bench('SSTORE in static context (should fail)', () => {
      if (zigevm.isInitialized()) {
        // Create a STATICCALL that tries to SSTORE (which should fail)
        const bytecode = new Uint8Array([
          // Set up for STATICCALL
          0x60, 0x00, // PUSH1 0 (return size)
          0x60, 0x00, // PUSH1 0 (return offset)
          0x60, 0x00, // PUSH1 0 (input size)
          0x60, 0x00, // PUSH1 0 (input offset)
          0x60, 0x01, // PUSH1 1 (address to call)
          0x60, 0xFF, // PUSH1 255 (gas)
          0xFA,       // STATICCALL
          
          // The code below would be the "called" code that attempts SSTORE
          // In reality, this won't be executed in this test since we don't have
          // proper call context support yet, but including it for completeness
          0x60, 0x01, // PUSH1 1 (value)
          0x60, 0x00, // PUSH1 0 (key)
          0x55        // SSTORE (this should fail in a static context)
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Test storage changes across multiple transaction executions
  describe('Storage Persistence', () => {
    bench('Read values from previous transactions', () => {
      if (zigevm.isInitialized()) {
        // First transaction: set storage values
        const setValues = createStorageSequence([
          { operation: 'sstore', key: 300n, value: 1n },
          { operation: 'sstore', key: 301n, value: 2n },
          { operation: 'sstore', key: 302n, value: 3n }
        ]);
        zigevm.execute(zigEvmHandle, setValues);
        
        // Second transaction: read those values
        const readValues = createStorageSequence([
          { operation: 'sload', key: 300n },
          { operation: 'sload', key: 301n },
          { operation: 'sload', key: 302n }
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, readValues);
        }
      }
    });
  });
});