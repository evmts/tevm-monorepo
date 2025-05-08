/**
 * Benchmark tests comparing ZigEVM with revm performance
 */
import { bench, describe } from 'vitest';
import path from 'path';
import { ZigEvm } from '../src/zigevm';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// Simple arithmetic operations benchmarks
describe('Simple Arithmetic', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    console.log("Initialized ZigEVM successfully for benchmarks");
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Create opcodes for benchmarking
  const operations = {
    add: new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x01]),          // PUSH1 0x01 PUSH1 0x02 ADD
    sub: new Uint8Array([0x60, 0x02, 0x60, 0x01, 0x03]),          // PUSH1 0x02 PUSH1 0x01 SUB
    mul: new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x02]),          // PUSH1 0x01 PUSH1 0x02 MUL
    div: new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x04]),          // PUSH1 0x01 PUSH1 0x02 DIV
    and: new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x16]),          // PUSH1 0x01 PUSH1 0x02 AND
    or:  new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x17]),          // PUSH1 0x01 PUSH1 0x02 OR
    xor: new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x18]),          // PUSH1 0x01 PUSH1 0x02 XOR
  };
  
  // Benchmark ZigEVM operations
  for (const [name, bytecode] of Object.entries(operations)) {
    bench(`ZigEVM ${name}`, () => {
      if (zigevm.isInitialized()) {
        zigevm.execute(zigEvmHandle, bytecode);
      }
    });
  }

  // More complex operations - control flow
  bench('ZigEVM Control Flow', () => {
    if (zigevm.isInitialized()) {
      // Complex loop with jumps
      const bytecode = new Uint8Array([
        0x60, 0x0A, // PUSH1 0x0A (loop counter)
        0x60, 0x00, // PUSH1 0x00 (accumulator)
        0x5B,       // JUMPDEST (loop start)
        0x90,       // SWAP1
        0x80,       // DUP1
        0x60, 0x00, // PUSH1 0x00
        0x14,       // EQ (check if counter is zero)
        0x60, 0x11, // PUSH1 0x11 (end address)
        0x57,       // JUMPI (jump to end if counter is zero)
        0x01,       // ADD (add counter to accumulator)
        0x90,       // SWAP1
        0x60, 0x01, // PUSH1 0x01
        0x03,       // SUB (decrement counter)
        0x60, 0x02, // PUSH1 0x02 (loop address)
        0x56,       // JUMP (jump to loop start)
        0x5B,       // JUMPDEST (end of loop)
      ]);
      zigevm.execute(zigEvmHandle, bytecode);
    }
  });
});