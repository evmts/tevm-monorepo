import { bench, describe } from 'vitest';
import { keccak256 as viemKeccak256, hexToBytes as viemHexToBytes, bytesToHex as viemBytesToHex } from 'viem/utils';
import { initWasm as initOriginalWasm, keccak256 as originalKeccak256, hexToBytes as originalHexToBytes, bytesToHex as originalBytesToHex } from './wasm-loader.js';
import { initWasm as initStdlibWasm, keccak256 as stdlibKeccak256, hexToBytes as stdlibHexToBytes, bytesToHex as stdlibBytesToHex } from './stdlib-loader.js';

describe('Stdlib vs Original Implementation Benchmark', async () => {
  // Initialize both WASM instances
  const originalInstance = await initOriginalWasm();
  const stdlibInstance = await initStdlibWasm();
  
  // Test data sizes
  const smallHex = '0x' + 'a'.repeat(64);  // 32 bytes (uint256, typical ETH value)
  const mediumHex = '0x' + 'b'.repeat(256); // 128 bytes
  const largeHex = '0x' + 'c'.repeat(2048); // 1024 bytes
  
  // Verify hash results
  console.log('Verification with ETH-sized input (32 bytes):');
  const viemResult = viemKeccak256(smallHex);
  const originalResult = originalKeccak256(originalInstance, smallHex);
  const stdlibResult = stdlibKeccak256(stdlibInstance, smallHex);
  
  console.log('Viem Result:', viemResult);
  console.log('Original Result:', originalResult);
  console.log('Stdlib Result:', stdlibResult);
  console.log('All Equal:', viemResult === originalResult && viemResult === stdlibResult);
  
  // Individual operations (typical Ethereum transaction)
  console.log('\nBenchmarking ETH value (32 bytes):');
  
  bench('Viem keccak256 - ETH value (32 bytes)', () => {
    viemKeccak256(smallHex);
  });
  
  bench('Original WASM keccak256 - ETH value (32 bytes)', () => {
    originalKeccak256(originalInstance, smallHex);
  });
  
  bench('Stdlib WASM keccak256 - ETH value (32 bytes)', () => {
    stdlibKeccak256(stdlibInstance, smallHex);
  });
  
  // Medium data (128 bytes)
  console.log('\nBenchmarking medium data (128 bytes):');
  
  bench('Viem keccak256 - Medium data (128 bytes)', () => {
    viemKeccak256(mediumHex);
  });
  
  bench('Original WASM keccak256 - Medium data (128 bytes)', () => {
    originalKeccak256(originalInstance, mediumHex);
  });
  
  bench('Stdlib WASM keccak256 - Medium data (128 bytes)', () => {
    stdlibKeccak256(stdlibInstance, mediumHex);
  });
  
  // Large data (1024 bytes)
  console.log('\nBenchmarking large data (1024 bytes):');
  
  bench('Viem keccak256 - Large data (1024 bytes)', () => {
    viemKeccak256(largeHex);
  });
  
  bench('Original WASM keccak256 - Large data (1024 bytes)', () => {
    originalKeccak256(originalInstance, largeHex);
  });
  
  bench('Stdlib WASM keccak256 - Large data (1024 bytes)', () => {
    stdlibKeccak256(stdlibInstance, largeHex);
  });
  
  // Batch operations (multiple operations in succession)
  console.log('\nBenchmarking batch operations (100 hashes):');
  
  // Create array of 100 slightly different inputs
  const batchInputs = Array(100).fill().map((_, i) => 
    '0x' + i.toString(16).padStart(64, 'a')
  );
  
  bench('Viem keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      viemKeccak256(input);
    }
  });
  
  bench('Original WASM keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      originalKeccak256(originalInstance, input);
    }
  });
  
  bench('Stdlib WASM keccak256 - Batch (100 hashes)', () => {
    for (const input of batchInputs) {
      stdlibKeccak256(stdlibInstance, input);
    }
  });

  // hexToBytes benchmarks
  console.log('\nBenchmarking hexToBytes (string to bytes conversion):');

  bench('Viem hexToBytes - ETH value (32 bytes)', () => {
    viemHexToBytes(smallHex);
  });

  bench('Original WASM hexToBytes - ETH value (32 bytes)', () => {
    originalHexToBytes(originalInstance, smallHex);
  });

  bench('Stdlib WASM hexToBytes - ETH value (32 bytes)', () => {
    stdlibHexToBytes(stdlibInstance, smallHex);
  });

  bench('Viem hexToBytes - Medium data (128 bytes)', () => {
    viemHexToBytes(mediumHex);
  });

  bench('Original WASM hexToBytes - Medium data (128 bytes)', () => {
    originalHexToBytes(originalInstance, mediumHex);
  });

  bench('Stdlib WASM hexToBytes - Medium data (128 bytes)', () => {
    stdlibHexToBytes(stdlibInstance, mediumHex);
  });

  bench('Viem hexToBytes - Large data (1024 bytes)', () => {
    viemHexToBytes(largeHex);
  });

  bench('Original WASM hexToBytes - Large data (1024 bytes)', () => {
    originalHexToBytes(originalInstance, largeHex);
  });

  bench('Stdlib WASM hexToBytes - Large data (1024 bytes)', () => {
    stdlibHexToBytes(stdlibInstance, largeHex);
  });

  // bytesToHex benchmarks
  console.log('\nBenchmarking bytesToHex (bytes to string conversion):');

  // Convert hex strings to bytes arrays for testing bytesToHex
  const smallBytes = viemHexToBytes(smallHex);
  const mediumBytes = viemHexToBytes(mediumHex);
  const largeBytes = viemHexToBytes(largeHex);

  bench('Viem bytesToHex - ETH value (32 bytes)', () => {
    viemBytesToHex(smallBytes);
  });

  bench('Original WASM bytesToHex - ETH value (32 bytes)', () => {
    originalBytesToHex(originalInstance, smallBytes);
  });

  bench('Stdlib WASM bytesToHex - ETH value (32 bytes)', () => {
    stdlibBytesToHex(stdlibInstance, smallBytes);
  });

  bench('Viem bytesToHex - Medium data (128 bytes)', () => {
    viemBytesToHex(mediumBytes);
  });

  bench('Original WASM bytesToHex - Medium data (128 bytes)', () => {
    originalBytesToHex(originalInstance, mediumBytes);
  });

  bench('Stdlib WASM bytesToHex - Medium data (128 bytes)', () => {
    stdlibBytesToHex(stdlibInstance, mediumBytes);
  });

  bench('Viem bytesToHex - Large data (1024 bytes)', () => {
    viemBytesToHex(largeBytes);
  });

  bench('Original WASM bytesToHex - Large data (1024 bytes)', () => {
    originalBytesToHex(originalInstance, largeBytes);
  });

  bench('Stdlib WASM bytesToHex - Large data (1024 bytes)', () => {
    stdlibBytesToHex(stdlibInstance, largeBytes);
  });
});