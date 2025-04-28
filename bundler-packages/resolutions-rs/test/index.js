const { module_factory_js, resolve_imports_js } = require('../index.js');
const assert = require('assert').strict;
const fs = require('fs').promises;
const path = require('path');
const join = path.join;

// Test code
const solCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Dependency.sol";
import "@lib/External.sol";

contract Test {
    function test() public pure returns (uint256) {
        return 42;
    }
}`;

async function main() {
  try {
    // Create a test file
    const testDir = join(__dirname, 'fixtures');
    const testFile = join(testDir, 'Test.sol');
    const depFile = join(testDir, 'Dependency.sol');
    
    // Ensure directory exists
    await fs.mkdir(testDir, { recursive: true });
    
    // Write test files
    await fs.writeFile(testFile, solCode);
    await fs.writeFile(depFile, '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Dependency {}');
    
    // Test resolve_imports_js
    console.log('Testing resolve_imports_js...');
    const remappings = {
      '@lib/': join(testDir, 'lib/')
    };
    
    const imports = await resolve_imports_js(testFile, solCode, remappings);
    console.log('Resolved imports:', imports);
    
    // Basic assertions
    assert(Array.isArray(imports), 'resolve_imports_js should return an array');
    assert(imports.length > 0, 'resolve_imports_js should return at least one import');
    assert(imports.some(imp => imp.original.includes("Dependency.sol")), 'Should find the Dependency.sol import');
    
    // Test module_factory_js
    console.log('Testing module_factory_js...');
    const moduleMap = await module_factory_js(testFile, solCode, remappings);
    console.log('Module map keys:', Object.keys(moduleMap));
    
    // Basic assertions
    assert(typeof moduleMap === 'object', 'module_factory_js should return an object');
    assert(Object.keys(moduleMap).length > 0, 'module_factory_js should return at least one module');
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Add a benchmark function to measure performance
async function benchmark() {
  console.log("\n===== Running Performance Benchmark =====");
  
  try {
    // Use a real-world example from the fixtures
    const fixturesDir = path.join(__dirname, '../fixtures');
    const entryContract = path.join(fixturesDir, 'contracts/level0/Contract_D0_I0.sol');
    
    // Read the contract content
    const contractCode = await fs.readFile(entryContract, 'utf8');
    
    console.log(`Using entry contract: ${entryContract}`);
    console.log(`Contract size: ${contractCode.length} bytes`);
    
    // Prepare remappings
    const remappings = {
      '@lib1/': path.join(fixturesDir, 'lib1/'),
      '@lib4/': path.join(fixturesDir, 'lib4/'),
      './': path.join(fixturesDir, 'contracts/')
    };
    
    // Array of library paths
    const libs = [
      fixturesDir,
      path.join(fixturesDir, 'lib1'),
      path.join(fixturesDir, 'lib4')
    ];
    
    console.log("Running performance test...");
    
    // Run the benchmark multiple times and measure average time
    const iterations = 5;
    let totalTime = 0;
    
    for (let i = 0; i < iterations; i++) {
      const startTime = process.hrtime.bigint();
      
      // Run the module factory
      const moduleMap = await module_factory_js(entryContract, contractCode, remappings, libs);
      
      const endTime = process.hrtime.bigint();
      const elapsedMs = Number(endTime - startTime) / 1_000_000;
      
      console.log(`Iteration ${i+1}: ${elapsedMs.toFixed(2)}ms, modules: ${Object.keys(moduleMap).length}`);
      totalTime += elapsedMs;
    }
    
    const avgTime = totalTime / iterations;
    console.log(`\nAverage time over ${iterations} iterations: ${avgTime.toFixed(2)}ms`);
    
    console.log("\nBenchmark completed successfully!");
  } catch (error) {
    console.error("Benchmark failed:", error);
  }
}

// Run both the test and benchmark
async function runAll() {
  await main();
  await benchmark();
}

runAll().catch(console.error);