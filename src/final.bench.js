import { bench, describe } from 'vitest';
import { keccak256 as viemKeccak256 } from 'viem/utils';
import { initWasm, keccak256 as wasmKeccak256, keccak256Stdlib as wasmKeccak256Stdlib } from './wasm-loader.js';

describe('Final Benchmark Comparison', async () => {
  // Initialize WASM instance
  const wasmInstance = await initWasm();
  
  // Test data sizes
  const smallHex = '0x' + 'a'.repeat(64);  // 32 bytes (uint256, typical ETH value)
  const mediumHex = '0x' + 'b'.repeat(256); // 128 bytes
  const largeHex = '0x' + 'c'.repeat(2048); // 1024 bytes
  
  // Verify hash results
  console.log('Verification with ETH-sized input (32 bytes):');
  const viemResult = viemKeccak256(smallHex);
  const wasmResult = wasmKeccak256(wasmInstance, smallHex);
  const wasmStdlibResult = wasmKeccak256Stdlib(wasmInstance, smallHex);
  console.log('Viem result:', viemResult);
  console.log('WASM result:', wasmResult);
  console.log('WASM Stdlib result:', wasmStdlibResult);
  console.log('All Equal:', viemResult === wasmResult && viemResult === wasmStdlibResult);
  
  // Individual operations (typical Ethereum transaction)
  console.log('\nBenchmarking individual operations (ETH transaction):');
  
  bench('Viem keccak256 - ETH value', () => {
    viemKeccak256(smallHex);
  });
  
  bench('WASM keccak256 - ETH value', () => {
    wasmKeccak256(wasmInstance, smallHex);
  });

  bench('WASM Stdlib keccak256 - ETH value', () => {
    wasmKeccak256Stdlib(wasmInstance, smallHex);
  });
  
  // Batch operations (multiple operations in succession)
  console.log('\nBenchmarking batch operations (100 hashes):');
  
  // Create array of 100 slightly different inputs
  const batchInputs = Array(100).fill().map((_, i) => 
    '0x' + i.toString(16).padStart(64, 'a')
  );
  
  // Large data (1024 bytes)
  console.log('\nBenchmarking large data (1024 bytes):');
  
  bench('Viem keccak256 - Large data', () => {
    viemKeccak256(largeHex);
  });
  
  bench('WASM keccak256 - Large data', () => {
    wasmKeccak256(wasmInstance, largeHex);
  });

  bench('WASM Stdlib keccak256 - Large data', () => {
    wasmKeccak256Stdlib(wasmInstance, largeHex);
  });
  
  // Batch operation benchmark
  bench('Viem keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      viemKeccak256(input);
    }
  });
  
  bench('WASM keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      wasmKeccak256(wasmInstance, input);
    }
  });

  bench('WASM Stdlib keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      wasmKeccak256Stdlib(wasmInstance, input);
    }
  });
  
  // Smart contract deployment (larger data + intensive processing)
  const contractCode = '0x' + 'e'.repeat(10000); // 5KB contract
  
  bench('Viem keccak256 - Contract deployment', () => {
    viemKeccak256(contractCode);
  });
  
  bench('WASM keccak256 - Contract deployment', () => {
    wasmKeccak256(wasmInstance, contractCode);
  });

  bench('WASM Stdlib keccak256 - Contract deployment', () => {
    wasmKeccak256Stdlib(wasmInstance, contractCode);
  });
});