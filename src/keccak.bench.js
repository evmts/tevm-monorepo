import { bench, describe } from 'vitest';
import { keccak256 as viemKeccak256, bytesToHex, hexToBytes } from 'viem/utils';
import { initWasm, keccak256 as wasmKeccak256, bytesToHex as wasmBytesToHex, hexToBytes as wasmHexToBytes } from './wasm-loader.js';

describe('Keccak256 Benchmark', async () => {
  // Initialize WASM module before running benchmarks
  const wasmInstance = await initWasm();

  // Test data with both Uint8Array and hex string formats
  const smallData = new Uint8Array(32).fill(0xAA);
  const smallHex = bytesToHex(smallData);

  const mediumData = new Uint8Array(1024).fill(0xBB);
  const mediumHex = bytesToHex(mediumData);

  const largeData = new Uint8Array(32768).fill(0xCC); // 32KB
  const largeHex = bytesToHex(largeData);

  // Verify implementations with hex string input
  const viemResult = viemKeccak256(smallHex);
  const wasmResult = wasmKeccak256(wasmInstance, smallHex);

  console.log('Verification with hex input (should be equal):');
  console.log('Viem:', viemResult);
  console.log('WASM:', wasmResult);
  console.log('Equal:', viemResult === wasmResult);
  console.log('');

  // Benchmark small data with hex string input
  bench('Viem keccak256 - Small hex string (32 bytes)', () => {
    viemKeccak256(smallHex);
  });

  bench('WASM keccak256 - Small hex string (32 bytes)', () => {
    wasmKeccak256(wasmInstance, smallHex);
  });

  // Benchmark medium data with hex string input
  bench('Viem keccak256 - Medium hex string (1KB)', () => {
    viemKeccak256(mediumHex);
  });

  bench('WASM keccak256 - Medium hex string (1KB)', () => {
    wasmKeccak256(wasmInstance, mediumHex);
  });

  // Benchmark large data with hex string input
  bench('Viem keccak256 - Large hex string (32KB)', () => {
    viemKeccak256(largeHex);
  });

  bench('WASM keccak256 - Large hex string (32KB)', () => {
    wasmKeccak256(wasmInstance, largeHex);
  });

  // Also benchmark the bytesToHex and hexToBytes functions
  bench('Viem bytesToHex - Small data (32 bytes)', () => {
    bytesToHex(smallData);
  });

  bench('WASM bytesToHex - Small data (32 bytes)', () => {
    wasmBytesToHex(wasmInstance, smallData);
  });

  bench('Viem hexToBytes - Small hex (32 bytes)', () => {
    hexToBytes(smallHex);
  });

  bench('WASM hexToBytes - Small hex (32 bytes)', () => {
    wasmHexToBytes(wasmInstance, smallHex);
  });
});