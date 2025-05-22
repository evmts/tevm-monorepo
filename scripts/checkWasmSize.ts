#!/usr/bin/env bun
/**
 * Script to measure and check the size of the WASM bundle
 * Usage:
 *   - `bun scripts/checkWasmSize.ts` - Just reports the sizes
 *   - `bun scripts/checkWasmSize.ts --check` - Fails if sizes exceed thresholds
 *   - `bun scripts/checkWasmSize.ts --check --raw-threshold 10.0 --gzipped-threshold 5.0` - Custom thresholds (in KB)
 * 
 * Or use npm scripts:
 *   - `bun check:wasm-size` - Just reports the sizes
 *   - `bun check:wasm-size:threshold` - Fails if sizes exceed thresholds
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';

// Default thresholds (in KB)
const DEFAULT_THRESHOLDS = {
  raw: 9.5, // 9.5KB (9728 bytes)
  gzipped: 4.8, // 4.8KB (4915 bytes)
};

// Parse command line arguments
const args = process.argv.slice(2);
const shouldCheck = args.includes('--check');
const thresholdRawKB = args.includes('--raw-threshold') 
  ? parseFloat(args[args.indexOf('--raw-threshold') + 1]) 
  : DEFAULT_THRESHOLDS.raw;
const thresholdGzippedKB = args.includes('--gzipped-threshold') 
  ? parseFloat(args[args.indexOf('--gzipped-threshold') + 1]) 
  : DEFAULT_THRESHOLDS.gzipped;

// Convert KB thresholds to bytes for precise comparison
const thresholdRawBytes = Math.floor(thresholdRawKB * 1024);
const thresholdGzippedBytes = Math.floor(thresholdGzippedKB * 1024);

// Find the repository root directory
const repoRoot = process.cwd();

// Define the paths
const distDir = join(repoRoot, 'dist');
const wasmPath = join(distDir, 'zigevm.wasm');
const gzippedPath = join(distDir, 'zigevm.wasm.gz');

// Ensure the WASM file exists
if (!existsSync(wasmPath)) {
  console.error('Error: WASM file not found at', wasmPath);
  console.error('Please run the build:wasm script first');
  process.exit(1);
}

// Get the raw size of the WASM file
const rawSizeBytes = fs.statSync(wasmPath).size;
const rawSizeKB = rawSizeBytes / 1024;

// Create gzipped file for measurement
execSync(`gzip -c "${wasmPath}" > "${gzippedPath}"`);
const gzippedSizeBytes = fs.statSync(gzippedPath).size;
const gzippedSizeKB = gzippedSizeBytes / 1024;

// Clean up gzipped file
fs.unlinkSync(gzippedPath);

// Print the sizes
console.log('=============== WASM Bundle Size Report ===============');
console.log(`Raw size:     ${rawSizeKB.toFixed(1)}KB (${rawSizeBytes} bytes)`);
console.log(`Gzipped size: ${gzippedSizeKB.toFixed(1)}KB (${gzippedSizeBytes} bytes)`);

// Check against thresholds if --check flag is provided
if (shouldCheck) {
  console.log('\nChecking against thresholds:');
  console.log(`Raw threshold:     ${thresholdRawKB.toFixed(1)}KB (${thresholdRawBytes} bytes)`);
  console.log(`Gzipped threshold: ${thresholdGzippedKB.toFixed(1)}KB (${thresholdGzippedBytes} bytes)`);
  
  let failed = false;
  
  if (rawSizeBytes > thresholdRawBytes) {
    console.error(`❌ Raw size ${rawSizeKB.toFixed(1)}KB exceeds threshold ${thresholdRawKB.toFixed(1)}KB`);
    failed = true;
  } else {
    console.log(`✅ Raw size ${rawSizeKB.toFixed(1)}KB is within threshold ${thresholdRawKB.toFixed(1)}KB`);
  }
  
  if (gzippedSizeBytes > thresholdGzippedBytes) {
    console.error(`❌ Gzipped size ${gzippedSizeKB.toFixed(1)}KB exceeds threshold ${thresholdGzippedKB.toFixed(1)}KB`);
    failed = true;
  } else {
    console.log(`✅ Gzipped size ${gzippedSizeKB.toFixed(1)}KB is within threshold ${thresholdGzippedKB.toFixed(1)}KB`);
  }
  
  if (failed) {
    console.error('\n❌ WASM bundle size check failed!');
    process.exit(1);
  } else {
    console.log('\n✅ WASM bundle size check passed!');
  }
}

console.log('\nWASM file path:', wasmPath);