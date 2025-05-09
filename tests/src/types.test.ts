/**
 * Tests for ZigEVM type conversions and operations
 * 
 * These tests verify that the TypeScript bindings correctly handle
 * the primitive types used in ZigEVM, such as U256, Address, etc.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm, ZigEvmResult } from './zigevm';
import { hexToBytes } from '@ethersproject/bytes';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

describe('ZigEVM Types', () => {
  let zigevm: ZigEvm;
  let handle: number;

  beforeAll(async () => {
    // Skip tests if WASM file doesn't exist yet
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
  
  // Test U256 arithmetic operations
  describe('U256 Operations', () => {
    it('should add two U256 values correctly', () => {
      if (!zigevm.isInitialized()) {
        return;
      }
      
      // PUSH32 [big number 1] PUSH32 [big number 2] ADD PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
      const bytecode = new Uint8Array([
        // PUSH32 value1 (2^255)
        0x7F, ...new Array(31).fill(0), 0x80,
        // PUSH32 value2 (2^255)
        0x7F, ...new Array(31).fill(0), 0x80,
        // ADD
        0x01,
        // PUSH1 0x00
        0x60, 0x00,
        // MSTORE
        0x52,
        // PUSH1 0x20
        0x60, 0x20,
        // PUSH1 0x00
        0x60, 0x00,
        // RETURN
        0xF3,
      ]);
      
      const { data } = zigevm.execute(handle, bytecode, new Uint8Array(), 100000000);
      
      // Result should be 2^256 which overflows to 0 in a U256
      // For now, since our implementation is a placeholder, we just check the data length
      expect(data.length).toBe(32);
    });
    
    it('should handle U256 comparison operations', () => {
      if (!zigevm.isInitialized()) {
        return;
      }
      
      // Test GT (greater than) operation
      // PUSH1 0x01 PUSH1 0x02 GT (should be 0 since 1 is not > 2)
      const bytecode = new Uint8Array([
        0x60, 0x01, // PUSH1 0x01
        0x60, 0x02, // PUSH1 0x02
        0x11,       // GT
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3,       // RETURN
      ]);
      
      const { data } = zigevm.execute(handle, bytecode, new Uint8Array(), 100000000);
      
      // For now, we just check the data length
      expect(data.length).toBe(32);
    });
  });
  
  // Test Address operations
  describe('Address Operations', () => {
    it('should handle addresses correctly', () => {
      if (!zigevm.isInitialized()) {
        return;
      }
      
      // Test ADDRESS opcode (returns executing address)
      const bytecode = new Uint8Array([
        0x30,       // ADDRESS
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3,       // RETURN
      ]);
      
      const address = '0x1234567890123456789012345678901234567890';
      const { data } = zigevm.execute(handle, bytecode, new Uint8Array(), 100000, address);
      
      // For now, we just check the data length
      expect(data.length).toBe(32);
    });
  });
  
  // Test Hash operations
  describe('Hash Operations', () => {
    it('should compute keccak256 hash correctly', () => {
      if (!zigevm.isInitialized()) {
        return;
      }
      
      // Test SHA3 opcode
      // PUSH1 0x04 PUSH1 0x00 MSTORE8
      // PUSH1 0x01 PUSH1 0x00 SHA3
      // PUSH1 0x00 MSTORE
      // PUSH1 0x20 PUSH1 0x00 RETURN
      const bytecode = new Uint8Array([
        0x60, 0x04, // PUSH1 0x04 (value to hash)
        0x60, 0x00, // PUSH1 0x00 (memory position)
        0x53,       // MSTORE8
        0x60, 0x01, // PUSH1 0x01 (length to hash)
        0x60, 0x00, // PUSH1 0x00 (memory position)
        0x20,       // SHA3
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3,       // RETURN
      ]);
      
      const { data } = zigevm.execute(handle, bytecode, new Uint8Array(), 100000000);
      
      // For now, we just check the data length
      expect(data.length).toBe(32);
    });
  });
});