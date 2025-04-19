import { resolveImports, processModule } from '../index.js';
import { strict as assert } from 'assert';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
    
    // Test resolveImports
    console.log('Testing resolveImports...');
    const remappings = {
      '@lib/': join(testDir, 'lib/')
    };
    
    const imports = await resolveImports(testFile, solCode, remappings);
    console.log('Resolved imports:', imports);
    
    // Basic assertions
    assert(Array.isArray(imports), 'resolveImports should return an array');
    assert(imports.length > 0, 'resolveImports should return at least one import');
    assert(imports.some(imp => imp.original === "./Dependency.sol"), 'Should find the Dependency.sol import');
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);