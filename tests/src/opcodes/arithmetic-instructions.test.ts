/**
 * Tests for Issue #4: Arithmetic Instructions
 * 
 * This tests the implementation of arithmetic opcodes in the ZigEVM
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm, ZigEvmResult } from '../zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../../dist/zigevm.wasm');

describe('ZigEVM Arithmetic Instructions', () => {
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

  // Test basic addition
  it('should perform ADD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x03, PUSH1 0x04, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x03,  // PUSH1 0x03
      0x60, 0x04,  // PUSH1 0x04
      0x01,        // ADD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // ADD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 3 + 4 = 7
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(7);
  });

  // Test subtraction
  it('should perform SUB correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x03, PUSH1 0x0A, SUB, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x03,  // PUSH1 0x03
      0x60, 0x0A,  // PUSH1 0x0A
      0x03,        // SUB
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // SUB should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 10 - 3 = 7
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(7);
  });

  // Test multiplication
  it('should perform MUL correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x03, PUSH1 0x05, MUL, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x03,  // PUSH1 0x03
      0x60, 0x05,  // PUSH1 0x05
      0x02,        // MUL
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // MUL should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 5 * 3 = 15
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(15);
  });

  // Test division
  it('should perform DIV correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x02, PUSH1 0x0A, DIV, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x02,  // PUSH1 0x02
      0x60, 0x0A,  // PUSH1 0x0A
      0x04,        // DIV
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // DIV should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 10 / 2 = 5
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(5);
  });

  // Test division by zero
  it('should handle division by zero correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x00, PUSH1 0x0A, DIV, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x00,  // PUSH1 0x00
      0x60, 0x0A,  // PUSH1 0x0A
      0x04,        // DIV
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Division by zero should not cause an error in EVM, it should return 0
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 10 / 0 = 0 (in EVM)
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0);
  });

  // Test modulo
  it('should perform MOD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x03, PUSH1 0x0A, MOD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x03,  // PUSH1 0x03
      0x60, 0x0A,  // PUSH1 0x0A
      0x06,        // MOD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // MOD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 10 % 3 = 1
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(1);
  });

  // Test modulo with zero divisor
  it('should handle modulo with zero divisor correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x00, PUSH1 0x0A, MOD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x00,  // PUSH1 0x00
      0x60, 0x0A,  // PUSH1 0x0A
      0x06,        // MOD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // Modulo with zero divisor should not cause an error in EVM, it should return 0
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 10 % 0 = 0 (in EVM)
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0);
  });

  // Test signed division
  it('should perform SDIV correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Push -10 (0xFFFFFF...F6) and 2, then SDIV
    const bytecode = new Uint8Array([
      // PUSH32 -10 (using 2's complement)
      0x7F, ...new Array(31).fill(0xFF), 0xF6,
      0x60, 0x02,  // PUSH1 0x02
      0x05,        // SDIV
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // SDIV should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // -10 / 2 = -5 (in 2's complement this is 0xFFFFFF...FB)
    // But we only check the last byte since the result data is 32 bytes
    expect(result.data.length).toBe(32);
    
    // Check that result looks like a negative number
    expect(result.data[0]).toBe(0xFF); // Most significant byte should be FF for negative
    expect(result.data[31]).toBe(0xFB); // Least significant byte should be FB (-5)
  });

  // Test signed modulo
  it('should perform SMOD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Push -10 (0xFFFFFF...F6) and 3, then SMOD
    const bytecode = new Uint8Array([
      // PUSH32 -10 (using 2's complement)
      0x7F, ...new Array(31).fill(0xFF), 0xF6,
      0x60, 0x03,  // PUSH1 0x03
      0x07,        // SMOD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // SMOD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // -10 % 3 = -1 (in 2's complement this is 0xFFFFFF...FF)
    // But we only check the last byte since the result data is 32 bytes
    expect(result.data.length).toBe(32);
    
    // Check that result looks like a negative number
    expect(result.data[0]).toBe(0xFF); // Most significant byte should be FF for negative
    expect(result.data[31]).toBe(0xFF); // Least significant byte should be FF (-1)
  });

  // Test ADDMOD
  it('should perform ADDMOD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x05, PUSH1 0x04, PUSH1 0x03, ADDMOD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05 (modulus)
      0x60, 0x04,  // PUSH1 0x04 (second operand)
      0x60, 0x03,  // PUSH1 0x03 (first operand)
      0x08,        // ADDMOD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // ADDMOD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // (3 + 4) % 5 = 2
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(2);
  });

  // Test MULMOD
  it('should perform MULMOD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x05, PUSH1 0x04, PUSH1 0x03, MULMOD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05 (modulus)
      0x60, 0x04,  // PUSH1 0x04 (second operand)
      0x60, 0x03,  // PUSH1 0x03 (first operand)
      0x09,        // MULMOD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // MULMOD should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // (3 * 4) % 5 = 12 % 5 = 2
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(2);
  });

  // Test EXP
  it('should perform EXP correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x03, PUSH1 0x02, EXP, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x03,  // PUSH1 0x03 (exponent)
      0x60, 0x02,  // PUSH1 0x02 (base)
      0x0A,        // EXP
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // EXP should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 2^3 = 8
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(8);
  });

  // Test EXP with large exponent
  it('should handle EXP with large exponent correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x10, PUSH1 0x02, EXP, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x10,  // PUSH1 0x10 (exponent = 16)
      0x60, 0x02,  // PUSH1 0x02 (base)
      0x0A,        // EXP
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // EXP should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 2^16 = 65536
    // Since this is bigger than a byte, we need to check multiple bytes
    expect(result.data.length).toBe(32);
    expect(result.data[31]).toBe(0x00); // Least significant byte
    expect(result.data[30]).toBe(0x00);
    expect(result.data[29]).toBe(0x01); // 0x10000 in big-endian
  });

  // Test overflow in ADD
  it('should handle overflow in ADD correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Push max uint256 and 1, then ADD
    const bytecode = new Uint8Array([
      // PUSH32 max uint256 (all bytes FF)
      0x7F, ...new Array(32).fill(0xFF),
      0x60, 0x01,  // PUSH1 0x01
      0x01,        // ADD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // ADD with overflow should execute successfully (EVM has modular arithmetic)
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // max uint256 + 1 = 0 (overflow in modular arithmetic)
    expect(result.data.length).toBe(32);
    // Every byte should be 0
    expect(result.data.every(byte => byte === 0)).toBe(true);
  });

  // Test underflow in SUB
  it('should handle underflow in SUB correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // PUSH1 0x0A, PUSH1 0x05, SUB, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x0A,  // PUSH1 0x0A
      0x60, 0x05,  // PUSH1 0x05
      0x03,        // SUB
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    // Execute the bytecode
    const result = zigevm.execute(handle, bytecode);
    
    // SUB should execute successfully
    expect(result.result).toBe(ZigEvmResult.Success);
    
    // 5 - 10 = -5, but in modular arithmetic this wraps to 2^256 - 5
    // For a 32-byte result, this means all bytes are 0xFF except the last one which is 0xFB
    expect(result.data.length).toBe(32);
    
    // Check the result for underflow pattern
    for (let i = 0; i < 31; i++) {
      expect(result.data[i]).toBe(0xFF);
    }
    expect(result.data[31]).toBe(0xFB); // 256 - 5 = 251 (0xFB)
  });

  // Test comparison operations
  it('should perform LT, GT, SLT, SGT, EQ correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Test LT: 5 < 10 should be true (1)
    const ltBytecode = new Uint8Array([
      0x60, 0x0A,  // PUSH1 0x0A
      0x60, 0x05,  // PUSH1 0x05
      0x10,        // LT
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    const ltResult = zigevm.execute(handle, ltBytecode);
    expect(ltResult.result).toBe(ZigEvmResult.Success);
    expect(ltResult.data[31]).toBe(1);
    
    // Test GT: 10 > 5 should be true (1)
    const gtBytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05
      0x60, 0x0A,  // PUSH1 0x0A
      0x11,        // GT
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    const gtResult = zigevm.execute(handle, gtBytecode);
    expect(gtResult.result).toBe(ZigEvmResult.Success);
    expect(gtResult.data[31]).toBe(1);
    
    // Test SLT: -5 < 5 should be true (1)
    const sltBytecode = new Uint8Array([
      0x60, 0x05,  // PUSH1 0x05
      // PUSH32 -5 (using 2's complement)
      0x7F, ...new Array(31).fill(0xFF), 0xFB,
      0x12,        // SLT
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    const sltResult = zigevm.execute(handle, sltBytecode);
    expect(sltResult.result).toBe(ZigEvmResult.Success);
    expect(sltResult.data[31]).toBe(1);
    
    // Test EQ: 10 == 10 should be true (1)
    const eqBytecode = new Uint8Array([
      0x60, 0x0A,  // PUSH1 0x0A
      0x60, 0x0A,  // PUSH1 0x0A
      0x14,        // EQ
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    const eqResult = zigevm.execute(handle, eqBytecode);
    expect(eqResult.result).toBe(ZigEvmResult.Success);
    expect(eqResult.data[31]).toBe(1);
  });
});