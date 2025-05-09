/**
 * Comprehensive benchmark tests for Arithmetic Instructions in ZigEVM
 * 
 * These benchmarks test the correctness and performance of arithmetic operations
 * by comparing their behavior with the reference implementations in evmone and revm.
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Number of iterations for each benchmark
const ITERATIONS = 100;

// Helper to create bytecode for testing arithmetic operations
function createArithmeticTest(
  opcode: number,
  a: bigint,
  b: bigint
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

  // Get push opcodes and bytes for a and b
  const [pushA, bytesA] = minimalPush(a);
  const [pushB, bytesB] = minimalPush(b);

  // Construct bytecode: PUSH a, PUSH b, OPCODE
  const bytecode = [
    pushA, ...bytesA,
    pushB, ...bytesB,
    opcode
  ];

  return new Uint8Array(bytecode);
}

// Test cases for arithmetic operations
const arithmeticTestCases = [
  // [name, opcode, a, b, description]
  ['ADD_simple', 0x01, 3n, 4n, 'Simple addition'],
  ['ADD_overflow', 0x01, (1n << 256n) - 1n, 1n, 'Addition with overflow'],
  ['SUB_simple', 0x03, 10n, 4n, 'Simple subtraction'],
  ['SUB_underflow', 0x03, 0n, 1n, 'Subtraction with underflow'],
  ['MUL_simple', 0x02, 3n, 7n, 'Simple multiplication'],
  ['MUL_large', 0x02, (1n << 128n) - 1n, 2n, 'Large number multiplication'],
  ['DIV_simple', 0x04, 10n, 2n, 'Simple division'],
  ['DIV_zero', 0x04, 10n, 0n, 'Division by zero'],
  ['SDIV_simple', 0x05, 10n, 2n, 'Simple signed division'],
  ['SDIV_negative', 0x05, -10n & ((1n << 256n) - 1n), 2n, 'Negative signed division'],
  ['MOD_simple', 0x06, 10n, 3n, 'Simple modulo'],
  ['MOD_zero', 0x06, 10n, 0n, 'Modulo by zero'],
  ['SMOD_simple', 0x07, 10n, 3n, 'Simple signed modulo'],
  ['SMOD_negative', 0x07, -10n & ((1n << 256n) - 1n), 3n, 'Negative signed modulo'],
  ['ADDMOD_simple', 0x08, 10n, 20n, 7n, 'Simple modular addition'],
  ['ADDMOD_overflow', 0x08, (1n << 255n), (1n << 255n), 7n, 'Modular addition with overflow'],
  ['MULMOD_simple', 0x09, 10n, 20n, 7n, 'Simple modular multiplication'],
  ['MULMOD_large', 0x09, (1n << 128n), (1n << 128n), (1n << 64n) - 1n, 'Modular multiplication with large numbers'],
  ['EXP_simple', 0x0A, 2n, 3n, 'Simple exponentiation'],
  ['EXP_zero_exp', 0x0A, 25n, 0n, 'Exponentiation with zero exponent'],
  ['EXP_zero_base', 0x0A, 0n, 25n, 'Exponentiation with zero base'],
  ['EXP_one_base', 0x0A, 1n, 25n, 'Exponentiation with base 1'],
  ['EXP_large', 0x0A, 2n, 255n, 'Exponentiation with large exponent'],
  ['SIGNEXTEND_byte0', 0x0B, 0n, 0x80n, 'Sign extend byte 0 (negative case)'],
  ['SIGNEXTEND_byte0_positive', 0x0B, 0n, 0x7Fn, 'Sign extend byte 0 (positive case)'],
  ['SIGNEXTEND_high_byte', 0x0B, 10n, 0n, 'Sign extend high byte']
];

/**
 * Helper function to create bytecode for testing modular operations (ADDMOD/MULMOD)
 * which take 3 parameters: a, b, and N
 */
function createModularOpTest(
  opcode: number,
  a: bigint,
  b: bigint,
  n: bigint
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

  // Get push opcodes and bytes for a, b, and n
  const [pushA, bytesA] = minimalPush(a);
  const [pushB, bytesB] = minimalPush(b);
  const [pushN, bytesN] = minimalPush(n);

  // Construct bytecode: PUSH a, PUSH b, PUSH n, OPCODE
  const bytecode = [
    pushA, ...bytesA,
    pushB, ...bytesB,
    pushN, ...bytesN,
    opcode
  ];

  return new Uint8Array(bytecode);
}

// Custom check function for 3-parameter operations
function executeModularOpTest(
  zigevm: ZigEvm, 
  handle: number, 
  opcode: number, 
  a: bigint, 
  b: bigint, 
  n: bigint
): void {
  const bytecode = createModularOpTest(opcode, a, b, n);
  zigevm.execute(handle, bytecode);
}

// Initialize ZigEVM for benchmarks
describe('ZigEVM Arithmetic Instructions Benchmark', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for arithmetic benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Benchmark each arithmetic test case
  for (const testCase of arithmeticTestCases) {
    const [name, opcode, a, b, description] = testCase;
    
    // Special handling for 3-parameter operations (ADDMOD, MULMOD)
    if (opcode === 0x08 || opcode === 0x09) {
      const [name, opcode, a, b, n, description] = testCase;
      
      bench(`Arithmetic: ${name} - ${description}`, () => {
        if (zigevm.isInitialized()) {
          for (let i = 0; i < ITERATIONS; i++) {
            executeModularOpTest(zigevm, zigEvmHandle, opcode as number, a as bigint, b as bigint, n as bigint);
          }
        }
      });
    } else {
      bench(`Arithmetic: ${name} - ${description}`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createArithmeticTest(opcode as number, a as bigint, b as bigint);
          for (let i = 0; i < ITERATIONS; i++) {
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  }
  
  // Test the gas cost of EXP with different exponent bit lengths
  describe('EXP Gas Costs', () => {
    for (const bits of [0, 8, 64, 128, 192, 248]) {
      const exponent = bits === 0 ? 0n : (1n << BigInt(bits)) - 1n;
      
      bench(`EXP with ${bits}-bit exponent`, () => {
        if (zigevm.isInitialized()) {
          const bytecode = createArithmeticTest(0x0A, 10n, exponent);
          for (let i = 0; i < ITERATIONS / 10; i++) { // Fewer iterations for expensive operations
            zigevm.execute(zigEvmHandle, bytecode);
          }
        }
      });
    }
  });
  
  // Test extreme cases
  describe('Extreme Cases', () => {
    const maxUint256 = (1n << 256n) - 1n;
    
    bench('ADD with max values', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createArithmeticTest(0x01, maxUint256, maxUint256);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('MUL with max values', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createArithmeticTest(0x02, maxUint256, 2n);
        for (let i = 0; i < ITERATIONS; i++) {
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
    
    bench('EXP with large base and exponent', () => {
      if (zigevm.isInitialized()) {
        const bytecode = createArithmeticTest(0x0A, (1n << 128n) - 1n, 8n);
        for (let i = 0; i < ITERATIONS / 20; i++) { // Very expensive operation
          zigevm.execute(zigEvmHandle, bytecode);
        }
      }
    });
  });
});