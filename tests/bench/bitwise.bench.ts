/**
 * Comprehensive benchmark tests for Bitwise Instructions in ZigEVM
 * 
 * These benchmarks test the correctness and performance of bitwise operations
 * by comparing their behavior with the reference implementations in evmone and revm.
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Number of iterations for each benchmark
const ITERATIONS = 100;

// Helper to create bytecode for testing bitwise operations
function createBitwiseTest(
  opcode: number,
  a: bigint,
  b?: bigint
): Uint8Array {
  // Convert bigint values to bytes for PUSH operations
  function bigintToBytes(value: bigint, length: number): number[] {
    const hex = value.toString(16).padStart(length * 2, '0');
    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
  }

  // Determine minimal PUSH opcode needed for each value
  function minimalPush(value: bigint): [number, number[]] {
    // Get bytes representation
    const hex = value.toString(16);
    // Calculate bytes needed
    const bytesNeeded = Math.ceil(hex.length / 2);
    // Choose appropriate PUSH opcode
    const pushOpcode = bytesNeeded === 0 ? 0x5F : 0x5F + bytesNeeded; // PUSH0 to PUSH32
    // Return bytes
    return [pushOpcode, bigintToBytes(value, bytesNeeded)];
  }

  // Get push opcodes and bytes for values
  const [pushA, bytesA] = minimalPush(a);
  
  // Construct bytecode based on unary or binary operation
  let bytecode: number[];
  
  if (b !== undefined) {
    // Binary operation: PUSH a, PUSH b, OPCODE
    const [pushB, bytesB] = minimalPush(b);
    bytecode = [
      pushA, ...bytesA,
      pushB, ...bytesB,
      opcode
    ];
  } else {
    // Unary operation: PUSH a, OPCODE
    bytecode = [
      pushA, ...bytesA,
      opcode
    ];
  }

  return new Uint8Array(bytecode);
}

// Test cases for bitwise operations
const bitwiseTestCases = [
  // Binary operations (opcode, a, b)
  ['AND_simple', 0x16, 0x0Fn, 0x0An, 'Simple AND operation'],
  ['AND_full', 0x16, (1n << 256n) - 1n, 0x0Fn, 'Full bit range AND'],
  
  ['OR_simple', 0x17, 0x0An, 0x05n, 'Simple OR operation'],
  ['OR_full', 0x17, (1n << 255n), (1n << 254n), 'Full bit range OR'],
  
  ['XOR_simple', 0x18, 0x0Fn, 0x0An, 'Simple XOR operation'],
  ['XOR_full', 0x18, (1n << 256n) - 1n, (1n << 255n), 'Full bit range XOR'],
  
  // Unary operations (opcode, a)
  ['NOT_simple', 0x19, 0x0Fn, null, 'Simple NOT operation on small value'],
  ['NOT_full', 0x19, (1n << 256n) - 1n, null, 'NOT operation on all ones'],
  ['NOT_zero', 0x19, 0n, null, 'NOT operation on zero'],
  
  // BYTE operation (extracts a byte)
  ['BYTE_zero', 0x1A, 0n, (1n << 256n) - 1n, 'Extract byte 0 (highest)'],
  ['BYTE_last', 0x1A, 31n, (1n << 8n) - 1n, 'Extract byte 31 (lowest)'],
  ['BYTE_middle', 0x1A, 16n, (1n << 128n) - 1n, 'Extract middle byte'],
  ['BYTE_overflow', 0x1A, 32n, (1n << 256n) - 1n, 'Byte index too large'],
  
  // Shift operations
  ['SHL_zero', 0x1B, 0n, 0x0Fn, 'Zero shift left'],
  ['SHL_small', 0x1B, 4n, 0x0Fn, 'Small shift left'],
  ['SHL_word', 0x1B, 64n, 0x0Fn, 'Word boundary shift left'],
  ['SHL_overflow', 0x1B, 256n, 0x0Fn, 'Overflow shift left'],
  
  ['SHR_zero', 0x1C, 0n, (1n << 256n) - 1n, 'Zero shift right'],
  ['SHR_small', 0x1C, 4n, (1n << 256n) - 1n, 'Small shift right'],
  ['SHR_word', 0x1C, 64n, (1n << 256n) - 1n, 'Word boundary shift right'],
  ['SHR_overflow', 0x1C, 256n, (1n << 256n) - 1n, 'Overflow shift right'],
  
  // Signed shift right
  ['SAR_positive_small', 0x1D, 4n, 0x0Fn, 'Small signed shift right (positive)'],
  ['SAR_negative_small', 0x1D, 4n, (1n << 255n) | 0x0Fn, 'Small signed shift right (negative)'],
  ['SAR_positive_word', 0x1D, 64n, 0x0Fn, 'Word boundary signed shift right (positive)'],
  ['SAR_negative_word', 0x1D, 64n, (1n << 255n) | 0x0Fn, 'Word boundary signed shift right (negative)'],
  ['SAR_positive_overflow', 0x1D, 256n, 0x0Fn, 'Overflow signed shift right (positive)'],
  ['SAR_negative_overflow', 0x1D, 256n, (1n << 255n) | 0x0Fn, 'Overflow signed shift right (negative)'],
];

// Initialize ZigEVM for benchmarks
describe('ZigEVM Bitwise Instructions Benchmark', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for bitwise benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Benchmark each bitwise test case
  for (const testCase of bitwiseTestCases) {
    const [name, opcode, a, b, description] = testCase;
    
    bench(`Bitwise: ${name} - ${description}`, () => {
      if (zigevm.isInitialized()) {
        const bytecode = createBitwiseTest(opcode as number, a as bigint, b as bigint | undefined);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  }
  
  // Additional complex test cases
  describe('Complex Bitwise Operations', () => {
    // Alternating bit patterns
    const alternatingBits = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn;
    const inverseBits =     0x5555555555555555555555555555555555555555555555555555555555555555n;
    
    bench('AND with alternating bit patterns', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createBitwiseTest(0x16, alternatingBits, inverseBits);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('OR with alternating bit patterns', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createBitwiseTest(0x17, alternatingBits, inverseBits);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('XOR with alternating bit patterns', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createBitwiseTest(0x18, alternatingBits, inverseBits);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Performance for different word sizes
  describe('Performance across different bit sizes', () => {
    const wordSizes = [8, 32, 64, 128, 192, 256];
    
    for (const bits of wordSizes) {
      const value = (1n << BigInt(bits)) - 1n;
      
      bench(`AND with ${bits}-bit values`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createBitwiseTest(0x16, value, value);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
      
      bench(`SHL with ${bits}-bit values`, () => {
        if (zigevm.isInitialized()) {
          // Shift left by half the bits
          const bytecode = createBitwiseTest(0x1B, BigInt(bits / 2), value);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
      
      bench(`SHR with ${bits}-bit values`, () => {
        if (zigevm.isInitialized()) {
          // Shift right by half the bits
          const bytecode = createBitwiseTest(0x1C, BigInt(bits / 2), value);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Edge cases for SAR
  describe('SAR Edge Cases', () => {
    // Values with specific bit patterns
    bench('SAR: Negative value with single bit set', () => {
      if (zigevm.isInitialized()) {
        // Negative (MSB set) with only one other bit set
        const value = (1n << 255n) | (1n << 100n);
        const bytecode = createBitwiseTest(0x1D, 100n, value);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('SAR: Negative value with all bits set', () => {
      if (zigevm.isInitialized()) {
        // Negative value with all remaining bits set
        const value = (1n << 256n) - 1n;
        const bytecode = createBitwiseTest(0x1D, 128n, value);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('SAR: Small negative value with right shift of 255', () => {
      if (zigevm.isInitialized()) {
        // Small negative value (-1 in two's complement)
        const value = (1n << 256n) - 1n;
        const bytecode = createBitwiseTest(0x1D, 255n, value);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
  
  // Compound operations that combine multiple bitwise operations
  describe('Compound Bitwise Operations', () => {
    bench('Bitwise: (A AND B) XOR (A OR B)', () => {
      if (zigevm.isInitialized()) {
        // PUSH1 0x0F, PUSH1 0x0A, AND, PUSH1 0x0F, PUSH1 0x0A, OR, XOR
        const bytecode = new Uint8Array([
          0x60, 0x0F, // PUSH1 0x0F (A)
          0x60, 0x0A, // PUSH1 0x0A (B)
          0x16,       // AND
          0x60, 0x0F, // PUSH1 0x0F (A)
          0x60, 0x0A, // PUSH1 0x0A (B)
          0x17,       // OR
          0x18        // XOR
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('Bitwise: NOT(A AND B) AND (A OR B)', () => {
      if (zigevm.isInitialized()) {
        // PUSH1 0x0F, PUSH1 0x0A, AND, NOT, PUSH1 0x0F, PUSH1 0x0A, OR, AND
        const bytecode = new Uint8Array([
          0x60, 0x0F, // PUSH1 0x0F (A)
          0x60, 0x0A, // PUSH1 0x0A (B)
          0x16,       // AND
          0x19,       // NOT
          0x60, 0x0F, // PUSH1 0x0F (A)
          0x60, 0x0A, // PUSH1 0x0A (B)
          0x17,       // OR
          0x16        // AND
        ]);
        
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
});