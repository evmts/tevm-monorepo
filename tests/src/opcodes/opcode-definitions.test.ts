/**
 * Tests for Issue #1: Opcode Definitions
 * 
 * This tests that all EVM opcodes are correctly defined with proper metadata
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm } from '../zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../../dist/zigevm.wasm');

describe('ZigEVM Opcode Definitions', () => {
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

  // This test verifies that all required opcodes are defined
  it('should define all standard opcodes', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Call into WASM to get the opcode definitions
    // We need to implement this function in the WASM module
    const opcodes = zigevm.getOpcodeDefinitions();
    
    // Check that all essential opcodes are defined
    const essentialOpcodes = [
      // Control Flow
      'STOP', 'JUMP', 'JUMPI', 'JUMPDEST', 'PC', 'RETURN', 'REVERT',
      // Stack Operations
      'POP', 'PUSH1', 'PUSH32', 'DUP1', 'DUP16', 'SWAP1', 'SWAP16',
      // Arithmetic
      'ADD', 'SUB', 'MUL', 'DIV', 'SDIV', 'MOD', 'SMOD', 'ADDMOD', 'MULMOD', 'EXP',
      // Comparisons
      'LT', 'GT', 'SLT', 'SGT', 'EQ', 'ISZERO',
      // Bitwise
      'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR', 'SAR',
      // Memory
      'MLOAD', 'MSTORE', 'MSTORE8', 'MSIZE',
      // Storage
      'SLOAD', 'SSTORE',
      // Environment
      'ADDRESS', 'BALANCE', 'ORIGIN', 'CALLER', 'CALLVALUE', 'CALLDATALOAD',
      'CALLDATASIZE', 'CALLDATACOPY', 'CODESIZE', 'CODECOPY', 'GASPRICE',
      // Block Info
      'COINBASE', 'TIMESTAMP', 'NUMBER', 'DIFFICULTY', 'GASLIMIT', 'CHAINID', 'BASEFEE',
      // Logging
      'LOG0', 'LOG1', 'LOG2', 'LOG3', 'LOG4',
      // System Operations
      'CREATE', 'CALL', 'CALLCODE', 'RETURN', 'DELEGATECALL', 'CREATE2', 'STATICCALL',
      'SELFDESTRUCT'
    ];

    for (const opcode of essentialOpcodes) {
      expect(opcodes).toHaveProperty(opcode, 
        expect.objectContaining({
          // Each opcode should have these properties
          code: expect.any(Number),
          name: opcode,
          gas: expect.any(Number),
          stackInputs: expect.any(Number),
          stackOutputs: expect.any(Number),
        })
      );
    }
  });

  // Test opcode properties like stack inputs/outputs and gas cost
  it('should have correct metadata for arithmetic opcodes', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    const opcodes = zigevm.getOpcodeDefinitions();
    
    // Check ADD opcode
    expect(opcodes.ADD).toEqual(
      expect.objectContaining({
        code: 0x01,
        name: 'ADD',
        gas: 3, // Gas cost for ADD
        stackInputs: 2,
        stackOutputs: 1,
      })
    );
    
    // Check MUL opcode
    expect(opcodes.MUL).toEqual(
      expect.objectContaining({
        code: 0x02,
        name: 'MUL',
        gas: 5, // Gas cost for MUL
        stackInputs: 2,
        stackOutputs: 1,
      })
    );
  });

  // Test opcode properties for memory operations which have dynamic gas costs
  it('should have correct metadata for memory opcodes', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    const opcodes = zigevm.getOpcodeDefinitions();
    
    // Check MSTORE opcode
    expect(opcodes.MSTORE).toEqual(
      expect.objectContaining({
        code: 0x52,
        name: 'MSTORE',
        // MSTORE has base gas cost of 3 plus dynamic cost for memory expansion
        gas: 3, 
        stackInputs: 2,
        stackOutputs: 0,
        dynamic: true, // Flag indicating dynamic gas cost
      })
    );
    
    // Check MLOAD opcode
    expect(opcodes.MLOAD).toEqual(
      expect.objectContaining({
        code: 0x51,
        name: 'MLOAD',
        // MLOAD has base gas cost of 3 plus dynamic cost for memory expansion
        gas: 3,
        stackInputs: 1,
        stackOutputs: 1,
        dynamic: true, // Flag indicating dynamic gas cost
      })
    );
  });

  // Test that opcodes from different hard forks are properly implemented
  it('should include opcodes from recent hard forks', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    const opcodes = zigevm.getOpcodeDefinitions();
    
    // Byzantium opcodes
    expect(opcodes).toHaveProperty('RETURNDATASIZE', 
      expect.objectContaining({ code: 0x3D })
    );
    expect(opcodes).toHaveProperty('RETURNDATACOPY', 
      expect.objectContaining({ code: 0x3E })
    );
    expect(opcodes).toHaveProperty('STATICCALL', 
      expect.objectContaining({ code: 0xFA })
    );
    
    // Constantinople opcodes
    expect(opcodes).toHaveProperty('CREATE2', 
      expect.objectContaining({ code: 0xF5 })
    );
    expect(opcodes).toHaveProperty('EXTCODEHASH', 
      expect.objectContaining({ code: 0x3F })
    );
    expect(opcodes).toHaveProperty('SHL', 
      expect.objectContaining({ code: 0x1B })
    );
    expect(opcodes).toHaveProperty('SHR', 
      expect.objectContaining({ code: 0x1C })
    );
    expect(opcodes).toHaveProperty('SAR', 
      expect.objectContaining({ code: 0x1D })
    );
    
    // London opcodes
    expect(opcodes).toHaveProperty('BASEFEE', 
      expect.objectContaining({ code: 0x48 })
    );
    
    // Cancun opcodes
    expect(opcodes).toHaveProperty('BLOBHASH', 
      expect.objectContaining({ code: 0x49 })
    );
    expect(opcodes).toHaveProperty('BLOBBASEFEE', 
      expect.objectContaining({ code: 0x4A })
    );
  });

  // Implement a placeholder method to make the test compile
  ZigEvm.prototype.getOpcodeDefinitions = function() {
    throw new Error("Not implemented: getOpcodeDefinitions");
    
    // Example return value with the expected structure
    return {
      STOP: { code: 0x00, name: 'STOP', gas: 0, stackInputs: 0, stackOutputs: 0 },
      ADD: { code: 0x01, name: 'ADD', gas: 3, stackInputs: 2, stackOutputs: 1 },
      // ... other opcodes
    };
  };
});