// Debugging script to get to the root of the JavaScript error
import path from 'node:path';
import fs from 'node:fs';
import { resolveImports } from '../../resolutions/src/resolveImports.js';

// Get the fixtures path and entry point
const FIXTURES_DIR = path.join(process.cwd(), 'benchmark', 'fixtures');
const ENTRY_POINT = path.join(FIXTURES_DIR, 'Main.sol');

// Create the remappings and libs
const remappings = {
  'lib/': path.join(FIXTURES_DIR, 'lib/'),
  'contracts/': path.join(FIXTURES_DIR, 'contracts/'),
  'interfaces/': path.join(FIXTURES_DIR, 'interfaces/'),
};

const libs = [
  path.join(FIXTURES_DIR, 'lib'),
  path.join(FIXTURES_DIR, 'shared')
];

// Read the entry point file
const entryPointContent = fs.readFileSync(ENTRY_POINT, 'utf8');

// Log parameters for debugging
console.log('ENTRY_POINT:', ENTRY_POINT);
console.log('ENTRY_POINT exists:', fs.existsSync(ENTRY_POINT));
console.log('ENTRY_POINT type:', typeof ENTRY_POINT);
console.log('remappings:', remappings);
console.log('libs:', libs);

// Directly examine the resolveImports function's implementation
console.log('\nExamining resolveImports function parameters:');
try {
  const result = resolveImports(ENTRY_POINT, entryPointContent, remappings, libs, true);
  console.log('Result:', result);
} catch (error) {
  console.error('Error in resolveImports:', error);
  
  // If the error is about string type, try to check the exact location
  if (error && error.message && error.message.includes('Type object is not of type string')) {
    console.error('\nDetailed parameter types:');
    console.error('absolutePath:', typeof ENTRY_POINT, ENTRY_POINT);
    console.error('code:', typeof entryPointContent, entryPointContent.substring(0, 100) + '...');
    console.error('remappings:', typeof remappings);
    
    // Try to reproduce error with individual parameters
    try {
      console.log('\nAttempting to reproduce error with manual parameters:');
      resolveImports('/path/to/file', 'content', {}, [], true);
      console.log('Basic test passed');
      
      // Test remappings
      console.log('\nTesting with remappings:');
      resolveImports('/path/to/file', 'content', remappings, [], true);
      console.log('Test with remappings passed');
      
      // Test libs
      console.log('\nTesting with libs:');
      resolveImports('/path/to/file', 'content', {}, libs, true);
      console.log('Test with libs passed');
    } catch (newError) {
      console.error('Error in manual test:', newError);
    }
  }
}