import { bench, describe } from 'vitest';
import { keccak256 as viemKeccak256, hexToBytes as viemHexToBytes, bytesToHex as viemBytesToHex } from 'viem/utils';
import { instantiateZigModule } from './wasm-loader.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

describe('Comprehensive Implementation Comparison', async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const wasmPath = path.resolve(__dirname, '../dist/zigevm.wasm');
  const wasmBuffer = fs.readFileSync(wasmPath);
  
  // Initialize WASM instance with all implementation methods
  const wasmModule = await instantiateZigModule(wasmBuffer);
  
  // Test data sizes
  const smallHex = '0x' + 'a'.repeat(64);  // 32 bytes (uint256, typical ETH value)
  const mediumHex = '0x' + 'b'.repeat(256); // 128 bytes
  const largeHex = '0x' + 'c'.repeat(2048); // 1024 bytes
  
  // Log all available exports to debug
  console.log('Available WASM exports:', Object.keys(wasmModule));

  // Verify hash results
  console.log('Verification with ETH-sized input (32 bytes):');
  const viemResult = viemKeccak256(smallHex);
  const wasmResult = wasmModule.keccak256(smallHex);
  const wasmStdlibResult = wasmModule.keccak256Stdlib(smallHex);
  // Skip old result until we fix the exports
  // const wasmOldResult = wasmModule.keccak256Old(smallHex);
  
  console.log('Viem result:        ', viemResult);
  console.log('WASM result:        ', wasmResult);
  console.log('WASM Stdlib result: ', wasmStdlibResult);
  console.log('Equal:', viemResult === wasmResult && viemResult === wasmStdlibResult);
  
  console.log('\nImportant Note: keccak256 and keccak256Stdlib should now be identical since we changed the implementation.');
  
  // Individual operations (typical Ethereum transaction)
  console.log('\nBenchmarking ETH value (32 bytes):');
  
  bench('Viem keccak256', () => {
    viemKeccak256(smallHex);
  });
  
  bench('WASM keccak256 (Stdlib impl)', () => {
    wasmModule.keccak256(smallHex);
  });
  
  bench('WASM keccak256Stdlib', () => {
    wasmModule.keccak256Stdlib(smallHex);
  });
  
  // Old implementation not available in exports
  // bench('WASM keccak256Old (Custom impl)', () => {
  //   wasmModule.keccak256Old(smallHex);
  // });
  
  // Large data (1024 bytes)
  console.log('\nBenchmarking large data (1024 bytes):');
  
  bench('Viem keccak256 - Large', () => {
    viemKeccak256(largeHex);
  });
  
  bench('WASM keccak256 (Stdlib impl) - Large', () => {
    wasmModule.keccak256(largeHex);
  });
  
  bench('WASM keccak256Stdlib - Large', () => {
    wasmModule.keccak256Stdlib(largeHex);
  });
  
  // Old implementation not available in exports
  // bench('WASM keccak256Old (Custom impl) - Large', () => {
  //   wasmModule.keccak256Old(largeHex);
  // });
  
  // Batch operations
  console.log('\nBenchmarking batch operations (100 hashes):');
  
  // Create array of 100 slightly different inputs
  const batchInputs = Array(100).fill().map((_, i) => 
    '0x' + i.toString(16).padStart(64, 'a')
  );
  
  bench('Viem keccak256 - Batch', () => {
    for (const input of batchInputs) {
      viemKeccak256(input);
    }
  });
  
  bench('WASM keccak256 (Stdlib impl) - Batch', () => {
    for (const input of batchInputs) {
      wasmModule.keccak256(input);
    }
  });
  
  bench('WASM keccak256Stdlib - Batch', () => {
    for (const input of batchInputs) {
      wasmModule.keccak256Stdlib(input);
    }
  });
  
  // Old implementation not available in exports
  // bench('WASM keccak256Old (Custom impl) - Batch', () => {
  //   for (const input of batchInputs) {
  //     wasmModule.keccak256Old(input);
  //   }
  // });

  // Add bytesToHex and hexToBytes benchmarks
  console.log('\nBenchmarking hex conversion functions:');

  // Convert smallHex to bytes for bytesToHex benchmarks
  const smallBytes = viemKeccak256(smallHex).slice(2);
  const mediumBytes = viemKeccak256(mediumHex).slice(2);

  // hexToBytes benchmarks
  console.log('\nBenchmarking hexToBytes (32 bytes):');

  bench('Viem hexToBytes', () => {
    viemHexToBytes(smallHex);
  });

  bench('WASM hexToBytes (Stdlib impl)', () => {
    wasmModule.hexToBytes(smallHex);
  });

  bench('WASM hexToBytesStdlib', () => {
    wasmModule.hexToBytesStdlib(smallHex);
  });

  // Skipping Old implementation for now
  // bench('WASM hexToBytesOld', () => {
  //   wasmModule.hexToBytesOld(smallHex);
  // });

  // bytesToHex benchmarks
  console.log('\nBenchmarking bytesToHex (32 bytes):');

  bench('Viem bytesToHex', () => {
    viemBytesToHex(smallBytes);
  });

  bench('WASM bytesToHex (Stdlib impl)', () => {
    wasmModule.bytesToHex(smallBytes);
  });

  bench('WASM bytesToHexStdlib', () => {
    wasmModule.bytesToHexStdlib(smallBytes);
  });

  // Skipping Old implementation for now
  // bench('WASM bytesToHexOld', () => {
  //   wasmModule.bytesToHexOld(smallBytes);
  // });
});