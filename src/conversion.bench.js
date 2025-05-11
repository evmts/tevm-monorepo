import { bench, describe } from 'vitest';
import { bytesToHex, hexToBytes } from 'viem/utils';
import { initWasm, bytesToHex as wasmBytesToHex, hexToBytes as wasmHexToBytes } from './wasm-loader.js';

describe('Conversion Functions Benchmark', async () => {
  // Initialize WASM module before running benchmarks
  const wasmInstance = await initWasm();

  // Create test data of various sizes
  const sizes = [32, 128, 512, 1024, 16384, 65536]; // Bytes
  
  // Generate test data for each size
  const testData = sizes.map(size => {
    const bytes = new Uint8Array(size);
    // Fill with repeating pattern
    for (let i = 0; i < size; i++) {
      bytes[i] = i % 256;
    }
    return bytes;
  });
  
  // Generate hex strings for each size
  const testHexes = testData.map(bytes => bytesToHex(bytes));
  
  // Verify conversions work correctly for largest size
  const largeBytes = testData[testData.length - 1];
  const largeHex = testHexes[testHexes.length - 1];
  
  const viemBytesToHexResult = bytesToHex(largeBytes);
  const wasmBytesToHexResult = wasmBytesToHex(wasmInstance, largeBytes);
  
  const viemHexToBytesResult = hexToBytes(largeHex);
  const wasmHexToBytesResult = wasmHexToBytes(wasmInstance, largeHex);
  
  console.log(`Verification for size ${largeBytes.length} bytes:`);
  console.log('bytesToHex match:', viemBytesToHexResult === wasmBytesToHexResult);
  console.log('hexToBytes match:', viemHexToBytesResult.length === wasmHexToBytesResult.length && 
    viemHexToBytesResult.every((val, i) => val === wasmHexToBytesResult[i]));
  console.log('');
  
  // Benchmark bytesToHex for each size
  console.log('Benchmarking bytesToHex:');
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const bytes = testData[i];
    
    bench(`Viem bytesToHex - ${size} bytes`, () => {
      bytesToHex(bytes);
    });
    
    bench(`WASM bytesToHex - ${size} bytes`, () => {
      wasmBytesToHex(wasmInstance, bytes);
    });
  }
  
  // Benchmark hexToBytes for each size
  console.log('\nBenchmarking hexToBytes:');
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const hex = testHexes[i];
    
    bench(`Viem hexToBytes - ${size} bytes`, () => {
      hexToBytes(hex);
    });
    
    bench(`WASM hexToBytes - ${size} bytes`, () => {
      wasmHexToBytes(wasmInstance, hex);
    });
  }
});