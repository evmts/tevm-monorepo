import { keccak256 as viemKeccak256 } from 'viem/utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initWasm, 
  keccak256 as wasmKeccak256, 
  keccak256Stdlib as wasmKeccak256Stdlib
} from './wasm-loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function for benchmarking
function benchmark(name, fn, iterations = 1000) {
  console.log(`\nRunning benchmark: ${name}`);
  
  // Warm-up phase
  for (let i = 0; i < 10; i++) {
    fn();
  }
  
  // Timing phase
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  
  const timePerOp = (end - start) / iterations;
  const opsPerSecond = Math.floor(1000 / timePerOp);
  
  console.log(`  ${timePerOp.toFixed(3)} ms per operation`);
  console.log(`  ${opsPerSecond.toLocaleString()} operations per second`);
  
  return { name, timePerOp, opsPerSecond };
}

async function main() {
  try {
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
    
    benchmark('Viem keccak256 - ETH value', () => {
      viemKeccak256(smallHex);
    });
    
    benchmark('WASM keccak256 - ETH value', () => {
      wasmKeccak256(wasmInstance, smallHex);
    });
    
    benchmark('WASM Stdlib keccak256 - ETH value', () => {
      wasmKeccak256Stdlib(wasmInstance, smallHex);
    });
    
    // Large data (1024 bytes)
    console.log('\nBenchmarking large data (1024 bytes):');
    
    benchmark('Viem keccak256 - Large data', () => {
      viemKeccak256(largeHex);
    });
    
    benchmark('WASM keccak256 - Large data', () => {
      wasmKeccak256(wasmInstance, largeHex);
    });
    
    benchmark('WASM Stdlib keccak256 - Large data', () => {
      wasmKeccak256Stdlib(wasmInstance, largeHex);
    });
    
    // Batch operations (multiple operations in succession)
    console.log('\nBenchmarking batch operations (100 hashes):');
    
    // Create array of 100 slightly different inputs
    const batchInputs = Array(100).fill().map((_, i) => 
      '0x' + i.toString(16).padStart(64, 'a')
    );
    
    // Batch operation benchmark
    benchmark('Viem keccak256 - Batch (100 hashes)', () => {
      for (const input of batchInputs) {
        viemKeccak256(input);
      }
    }, 10); // Fewer iterations since each does 100 hashes
    
    benchmark('WASM keccak256 - Batch (100 hashes)', () => {
      for (const input of batchInputs) {
        wasmKeccak256(wasmInstance, input);
      }
    }, 10);
    
    benchmark('WASM Stdlib keccak256 - Batch (100 hashes)', () => {
      for (const input of batchInputs) {
        wasmKeccak256Stdlib(wasmInstance, input);
      }
    }, 10);
    
    // Smart contract deployment (larger data + intensive processing)
    const contractCode = '0x' + 'e'.repeat(10000); // 5KB contract
    
    console.log('\nBenchmarking contract deployment (5KB):');
    
    benchmark('Viem keccak256 - Contract deployment', () => {
      viemKeccak256(contractCode);
    }, 100); // Fewer iterations due to large size
    
    benchmark('WASM keccak256 - Contract deployment', () => {
      wasmKeccak256(wasmInstance, contractCode);
    }, 100);
    
    benchmark('WASM Stdlib keccak256 - Contract deployment', () => {
      wasmKeccak256Stdlib(wasmInstance, contractCode);
    }, 100);
    
  } catch (error) {
    console.error('Error in benchmark:', error);
  }
}

main();