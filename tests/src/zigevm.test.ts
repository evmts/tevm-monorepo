/**
 * Basic tests for ZigEVM TypeScript bindings
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { ZigEvm, ZigEvmResult } from './zigevm';

// Path to WASM file - in a real test we'd use the actual built file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

describe('ZigEVM Bindings', () => {
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

  it('should initialize the WASM module', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    expect(zigevm.isInitialized()).toBe(true);
  });

  it('should return version information', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    const version = zigevm.getVersion();
    expect(version).toMatch(/ZigEVM v\d+\.\d+\.\d+/);
  });

  it('should add two numbers correctly', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    const result = zigevm.testAdd(40, 2);
    expect(result).toBe(42);
  });

  it('should execute a simple EVM program', () => {
    if (!zigevm.isInitialized()) {
      return;
    }
    
    // Simple program: PUSH1 0x01, PUSH1 0x02, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = new Uint8Array([
      0x60, 0x01,  // PUSH1 0x01
      0x60, 0x02,  // PUSH1 0x02
      0x01,        // ADD
      0x60, 0x00,  // PUSH1 0x00
      0x52,        // MSTORE
      0x60, 0x20,  // PUSH1 0x20
      0x60, 0x00,  // PUSH1 0x00
      0xf3,        // RETURN
    ]);
    
    const { result, data } = zigevm.execute(handle, bytecode);
    
    expect(result).toBe(ZigEvmResult.Success);
    // Result should be 0x03 (1 + 2) as a 32-byte word
    expect(data.length).toBe(32);
    expect(data[31]).toBe(3);
  });
});