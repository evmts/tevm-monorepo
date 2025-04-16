// Simple test script to debug the js module factory
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { moduleFactory } from '../../resolutions/src/moduleFactory.js';
import { safeFao } from '../../resolutions/src/utils/safeFao.js';
import { runSync } from 'effect/Effect';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup paths
const FIXTURES_DIR = join(__dirname, 'fixtures');
const ENTRY_POINT = join(FIXTURES_DIR, 'Main.sol');

// Create remappings and libs for the test
const remappings = {
  'lib/': join(FIXTURES_DIR, 'lib/'),
  'contracts/': join(FIXTURES_DIR, 'contracts/'),
  'interfaces/': join(FIXTURES_DIR, 'interfaces/'),
};

const libs = [
  join(FIXTURES_DIR, 'lib'),
  join(FIXTURES_DIR, 'shared')
];

// Create a FileAccessObject
const fao = {
  readFileSync: fs.readFileSync,
  readFile: (path, encoding) => Promise.resolve(fs.readFileSync(path, encoding)),
  existsSync: fs.existsSync,
  exists: async (file) => fs.existsSync(file)
};

// Debug the parameters
console.log('Testing parameters:');
console.log('ENTRY_POINT:', ENTRY_POINT);
console.log('ENTRY_POINT type:', typeof ENTRY_POINT);
console.log('entryPointContent type:', typeof fs.readFileSync(ENTRY_POINT, 'utf8'));
console.log('remappings type:', typeof remappings);
console.log('remappings is object:', remappings instanceof Object);
console.log('libs type:', typeof libs);
console.log('libs is array:', Array.isArray(libs));

// Convert remappings to strings if needed
const stringifyRemappings = (remaps) => {
  const result = {};
  for (const key in remaps) {
    result[key] = String(remaps[key]);
  }
  return result;
};

// Read the file content
const entryPointContent = fs.readFileSync(ENTRY_POINT, 'utf8');

try {
  // Try to run the moduleFactory
  console.log('\nRunning moduleFactory with original parameters...');
  const result = runSync(moduleFactory(
    ENTRY_POINT,
    entryPointContent,
    remappings,
    libs,
    safeFao(fao),
    true
  ));
  
  console.log('Success! ModuleFactory returned result');
  console.log('Result type:', typeof result);
  console.log('Is Map?', result instanceof Map);
  console.log('Size:', result instanceof Map ? result.size : 'N/A');
} catch (error) {
  console.error('\nModuleFactory execution failed:');
  console.error(error);
  
  try {
    // Try with stringified remappings
    console.log('\nTrying with stringified remappings...');
    const result = runSync(moduleFactory(
      ENTRY_POINT,
      entryPointContent,
      stringifyRemappings(remappings),
      libs,
      safeFao(fao),
      true
    ));
    
    console.log('Success! ModuleFactory returned result with stringified remappings');
    console.log('Result type:', typeof result);
    console.log('Is Map?', result instanceof Map);
    console.log('Size:', result instanceof Map ? result.size : 'N/A');
  } catch (error) {
    console.error('\nModuleFactory execution with stringified remappings failed:');
    console.error(error);
  }
}