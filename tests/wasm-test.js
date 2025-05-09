// Test script to examine WASM module function signatures
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wasmPath = process.argv[2] || resolve(__dirname, '../dist/zigevm.wasm');

async function testWasm() {
  try {
    console.log(`Testing WASM file: ${wasmPath}`);
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    
    // Create the instance
    const importObject = {};
    const instance = await WebAssembly.instantiate(wasmModule, importObject);
    const exports = instance.exports;
    
    // Print available exports
    console.log("Available exports:", Object.keys(exports));
    
    // Test function signatures
    for (const key in exports) {
      if (typeof exports[key] === 'function') {
        console.log(`\nTesting ${key}...`);
        console.log(`  Type:`, typeof exports[key]);
        console.log(`  toString:`, exports[key].toString());
        
        try {
          // Try a simple function call
          if (key === 'zig_add') {
            console.log(`  zig_add(3, 4) = ${exports.zig_add(3, 4)}`);
          }
          
          // Test create/destroy
          if (key === 'zig_evm_create') {
            const handle = exports.zig_evm_create();
            console.log(`  zig_evm_create() = ${handle}`);
            
            if (handle !== 0) {
              const destroyResult = exports.zig_evm_destroy(handle);
              console.log(`  zig_evm_destroy(${handle}) = ${destroyResult}`);
            }
          }
          
          // Test version
          if (key === 'zig_evm_version') {
            const memory = exports.memory;
            const bufferSize = 32;
            const bufferPtr = 1024;
            const memoryArray = new Uint8Array(memory.buffer);
            
            const length = exports.zig_evm_version(bufferPtr, bufferSize);
            const bytes = memoryArray.slice(bufferPtr, bufferPtr + length);
            const version = new TextDecoder().decode(bytes);
            console.log(`  zig_evm_version result: ${version}`);
          }
          
          // Test execute
          if (key === 'zig_evm_execute') {
            const memory = exports.memory;
            const memoryArray = new Uint8Array(memory.buffer);
            
            const handle = exports.zig_evm_create();
            console.log(`  Created handle: ${handle}`);
            
            if (handle !== 0) {
              // Simple bytecode: PUSH1 0x01, PUSH1 0x02, ADD, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
              const bytecode = new Uint8Array([
                0x60, 0x01, 0x60, 0x02, 0x01, 0x60, 0x00, 0x52, 0x60, 0x20, 0x60, 0x00, 0xf3
              ]);
              
              // Copy bytecode to memory
              const codePtr = 1024;
              memoryArray.set(bytecode, codePtr);
              
              // Set up empty calldata
              const calldataPtr = codePtr + bytecode.length;
              
              // Set up addresses
              const addressPtr = calldataPtr;
              const callerPtr = addressPtr + 20;
              
              // Set up result buffer
              const resultPtr = callerPtr + 20;
              const resultLenPtr = resultPtr + 1024;
              
              // Set result buffer size
              const view = new DataView(memory.buffer);
              view.setUint32(resultLenPtr, 1024, true);
              
              // Call execute
              console.log(`  Calling zig_evm_execute...`);
              console.log(`  Arguments:`);
              console.log(`    handle: ${handle}`);
              console.log(`    codePtr: ${codePtr}, codeLen: ${bytecode.length}`);
              console.log(`    dataPtr: ${calldataPtr}, dataLen: 0`);
              console.log(`    valuePtr: 0`);
              console.log(`    gasLimit: 100000`);
              console.log(`    addressPtr: ${addressPtr}, callerPtr: ${callerPtr}`);
              console.log(`    resultPtr: ${resultPtr}, resultLenPtr: ${resultLenPtr}`);
              
              try {
                const result = exports.zig_evm_execute(
                  handle,
                  codePtr, bytecode.length,
                  calldataPtr, 0,
                  0, // value ptr (not used)
                  100000, // gas limit
                  addressPtr, callerPtr,
                  resultPtr, resultLenPtr
                );
                
                console.log(`  Execute result code: ${result}`);
                
                // Read result size
                const resultSize = view.getUint32(resultLenPtr, true);
                console.log(`  Result size: ${resultSize}`);
                
                // Read result data
                const resultData = memoryArray.slice(resultPtr, resultPtr + resultSize);
                console.log(`  Result data:`, Array.from(resultData).map(b => b.toString(16).padStart(2, '0')).join(''));
                
                // Check if we got the expected result (3 in the last byte)
                if (resultSize === 32 && resultData[31] === 3) {
                  console.log(`  SUCCESS! Got expected result (3)`);
                } else {
                  console.log(`  FAILED! Did not get expected result`);
                }
              } catch (error) {
                console.log(`  ERROR calling zig_evm_execute:`, error);
              }
              
              // Clean up
              exports.zig_evm_destroy(handle);
            }
          }
        } catch (error) {
          console.log(`  Error testing ${key}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testWasm();