/**
 * Utilities for ZigEVM testing
 */
import { ZigEvm } from './zigevm';
import { formatUnits, parseUnits } from 'viem';
import { Stack } from '../../src/stack/stack';
import { Memory } from '../../src/memory/memory';
import { U256, Address, Error } from '../../src/util/types';

/**
 * Helper function to wait for ZigEVM to be available
 * @param wasmPath Path to the WASM file
 * @returns A configured ZigEVM instance and handle
 */
export async function setupZigEvm(wasmPath: string): Promise<{ zigevm: ZigEvm, handle: number }> {
  const zigevm = new ZigEvm();
  await zigevm.init(wasmPath);
  const handle = zigevm.create();
  return { zigevm, handle };
}

/**
 * Generate bytecode for simple EVM operations
 */
export const bytecodeTemplates = {
  /**
   * Create bytecode to perform a simple integer addition
   * @param a First operand
   * @param b Second operand
   * @returns Bytecode that adds two numbers and returns the result
   */
  add: (a: number, b: number): Uint8Array => {
    return new Uint8Array([
      0x60, a,      // PUSH1 a
      0x60, b,      // PUSH1 b
      0x01,         // ADD
      0x60, 0x00,   // PUSH1 0x00
      0x52,         // MSTORE
      0x60, 0x20,   // PUSH1 0x20
      0x60, 0x00,   // PUSH1 0x00
      0xF3,         // RETURN
    ]);
  },
  
  /**
   * Create bytecode for storage operations
   * @param key Storage key
   * @param value Value to store
   * @returns Bytecode that performs a storage operation
   */
  storage: (key: number, value: number): Uint8Array => {
    return new Uint8Array([
      0x60, value,  // PUSH1 value
      0x60, key,    // PUSH1 key
      0x55,         // SSTORE
      0x60, key,    // PUSH1 key
      0x54,         // SLOAD
      0x60, 0x00,   // PUSH1 0x00
      0x52,         // MSTORE
      0x60, 0x20,   // PUSH1 0x20
      0x60, 0x00,   // PUSH1 0x00
      0xF3,         // RETURN
    ]);
  },
  
  /**
   * Create bytecode for a loop that sums numbers from 1 to n
   * @param n Upper bound of the sum
   * @returns Bytecode that computes the sum 1+2+...+n
   */
  sum: (n: number): Uint8Array => {
    // Complex bytecode that sums 1..n
    return new Uint8Array([
      0x60, n,      // PUSH1 n (loop counter)
      0x60, 0x00,   // PUSH1 0x00 (accumulator)
      0x5B,         // JUMPDEST (loop start)
      0x90,         // SWAP1
      0x80,         // DUP1
      0x60, 0x00,   // PUSH1 0x00
      0x14,         // EQ (check if counter is zero)
      0x60, 0x1B,   // PUSH1 0x1B (end address)
      0x57,         // JUMPI (jump to end if counter is zero)
      0x01,         // ADD (add counter to accumulator)
      0x90,         // SWAP1
      0x60, 0x01,   // PUSH1 0x01
      0x03,         // SUB (decrement counter)
      0x60, 0x02,   // PUSH1 0x02 (loop address)
      0x56,         // JUMP (jump to loop start)
      0x5B,         // JUMPDEST (end of loop)
      0x60, 0x00,   // PUSH1 0x00
      0x52,         // MSTORE
      0x60, 0x20,   // PUSH1 0x20
      0x60, 0x00,   // PUSH1 0x00
      0xF3,         // RETURN
    ]);
  }
};

/**
 * Format a BigInt as a human-readable string with Ether units
 * @param value Value in wei
 * @returns Formatted string with units
 */
export function formatEther(value: bigint): string {
  return formatUnits(value, 18) + ' ETH';
}

/**
 * Parse a human-readable string with Ether units to a BigInt
 * @param value String value with units
 * @returns BigInt in wei
 */
export function parseEther(value: string): bigint {
  return parseUnits(value, 18);
}

/**
 * Create a hexadecimal string from bytes
 * @param bytes Byte array
 * @returns Hex string with 0x prefix
 */
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Test address constants
 */
export const TEST_ADDRESSES = {
  ZERO: '0x0000000000000000000000000000000000000000',
  USER: '0x1234567890123456789012345678901234567890',
  CONTRACT: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
};

/**
 * Create a mock stack for testing
 * Uses the actual Stack implementation
 */
export function createMockStack(): Stack {
  return Stack.init();
}

/**
 * Create a mock memory for testing
 * Uses the actual Memory implementation
 */
export async function createMockMemory(): Promise<Memory> {
  try {
    return Memory.init(global.std?.testing?.allocator || {});
  } catch (error) {
    throw new Error('Failed to create mock memory: ' + error.message);
  }
}

/**
 * Execute a single instruction opcode with mocked environment
 * 
 * @param opcode Opcode to execute
 * @param stack Stack to use (if not provided, a new one will be created)
 * @param memory Memory to use (if not provided, a new one will be created)
 * @returns Result of execution
 */
export async function executeInstruction(
  opcode: number,
  stack?: Stack,
  memory?: Memory
): Promise<void> {
  // Create stack and memory if not provided
  const useStack = stack || createMockStack();
  const useMemory = memory || await createMockMemory();
  
  // Create minimal bytecode with just the opcode
  const code = new Uint8Array([opcode]);
  let pc = 0;
  let gas_left = 100000;
  let gas_refund = 0;
  
  // Try to import and use the dispatch function
  try {
    const dispatch = await import('../../src/opcodes/dispatch');
    await dispatch.executeInstruction(
      useStack,
      useMemory,
      code,
      pc,
      gas_left,
      gas_refund
    );
  } catch (error) {
    throw new Error(`Failed to execute instruction 0x${opcode.toString(16)}: ${error.message}`);
  }
}

/**
 * Create a value representing a negative number in 256-bit two's complement
 * 
 * @param value Positive number to convert to negative
 * @returns U256 representing the negative value in two's complement
 */
export function createNegativeU256(value: number | bigint): U256 {
  // To get -x in two's complement: (2^256 - x)
  const valueU256 = typeof value === 'number' ? 
    U256.fromU64(BigInt(value)) : 
    U256.fromU64(value as bigint);
  
  return U256.max().sub(valueU256).add(U256.one());
}

/**
 * Check if a U256 value is negative (has the high bit set)
 * 
 * @param value U256 value to check
 * @returns True if the value is negative (high bit set)
 */
export function isNegativeU256(value: U256): boolean {
  // Check if the highest bit is set (bit 255)
  return (value.words[3] & 0x8000000000000000n) !== 0n;
}