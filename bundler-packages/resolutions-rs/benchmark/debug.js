// Debug script to identify the exact cause of the JavaScript error
import fs from 'node:fs';
import path from 'node:path';
import { runSync } from 'effect/Effect';
import { moduleFactory as jsModuleFactory } from '../../resolutions/src/moduleFactory.js';
import { safeFao } from '../../resolutions/src/utils/safeFao.js';

// Debug helper 
function stringifyWithType(value) {
  return `${typeof value}: ${JSON.stringify(value)}`;
}

// Create a more verbose logging helper
function debugLog(...args) {
  console.log('[DEBUG]', ...args.map(arg => {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return `[Object: ${typeof arg}]`;
      }
    }
    return arg;
  }));
}

// Setup constants similar to the benchmark
const PATH_PREFIX = process.cwd();
const FIXTURES_DIR = path.join(PATH_PREFIX, 'benchmark', 'fixtures');
const ENTRY_POINT = path.join(FIXTURES_DIR, 'Main.sol');

// Create FileAccessObject
const fao = {
  readFileSync: fs.readFileSync,
  readFile: (path, encoding) => Promise.resolve(fs.readFileSync(path, encoding)),
  existsSync: fs.existsSync,
  exists: async (file) => fs.existsSync(file)
};

// Create remappings
const remappings = {
  'lib/': path.join(FIXTURES_DIR, 'lib/'),
  'contracts/': path.join(FIXTURES_DIR, 'contracts/'),
  'interfaces/': path.join(FIXTURES_DIR, 'interfaces/'),
};

// Convert libs to an array of strings
const libs = [
  path.join(FIXTURES_DIR, 'lib'),
  path.join(FIXTURES_DIR, 'shared')
].map(lib => lib.toString());

// Read entry point content
const entryPointContent = fs.readFileSync(ENTRY_POINT, 'utf8');

// Debug each parameter
debugLog('ENTRY_POINT', ENTRY_POINT, typeof ENTRY_POINT);
debugLog('entryPointContent length', entryPointContent.length, typeof entryPointContent);
debugLog('remappings', remappings, typeof remappings);
debugLog('libs', libs, typeof libs);
debugLog('safeFao', typeof safeFao(fao));
debugLog('sync', true, typeof true);

try {
  // Debug each step of the calling process
  debugLog('Starting moduleFactory call...');
  
  // Debug each parameter in detail
  debugLog('Parameter: absolutePath', stringifyWithType(ENTRY_POINT));
  debugLog('Parameter: rawCode', `${typeof entryPointContent}: [${entryPointContent.length} characters]`);
  debugLog('Parameter: remappings', stringifyWithType(remappings));
  debugLog('Parameter: libs', stringifyWithType(libs));
  debugLog('Parameter: fao', `${typeof safeFao(fao)}: [FileAccessObject]`);
  debugLog('Parameter: sync', stringifyWithType(true));
  
  // Attempt to actually call the moduleFactory
  const result = runSync(jsModuleFactory(
    String(ENTRY_POINT),
    String(entryPointContent),
    remappings,
    libs,
    safeFao(fao),
    true
  ));
  
  debugLog('Module factory completed successfully!');
  debugLog('Result type:', typeof result);
  debugLog('Is Map?', result instanceof Map);
  debugLog('Size:', result instanceof Map ? result.size : 'N/A');
} catch (error) {
  console.error('Error in moduleFactory call:', error);
  
  // Analyze the error in detail
  debugLog('Error type:', typeof error);
  debugLog('Error name:', error?.name);
  debugLog('Error message:', error?.message);
  
  // Check if it's an Effect error and try to extract more details
  if (error.name === 'FiberFailure') {
    debugLog('Effect FiberFailure detected');
    debugLog('Cause:', error?.cause);
    
    // Try to access the inner error if it exists
    const innerError = error?._tag === 'Fail' ? error.error : null;
    if (innerError) {
      debugLog('Inner error:', innerError);
      debugLog('Inner error message:', innerError.message);
    }
  }
}

// Now let's try the Rust implementation
import { run as runRustModuleFactory } from './rust_bridge.js';

debugLog('\n\n--- Testing Rust Implementation ---\n');

try {
  debugLog('Starting Rust module factory...');
  const result = runRustModuleFactory(
    ENTRY_POINT,
    entryPointContent,
    remappings,
    libs
  );
  
  debugLog('Rust module factory succeeded!');
  debugLog('Result type:', typeof result);
  if (result) {
    const moduleCount = Object.keys(result).length;
    debugLog('Modules count:', moduleCount);
    debugLog('First few modules:', Object.keys(result).slice(0, 3));
  } else {
    debugLog('Result is empty or undefined');
  }
} catch (error) {
  console.error('Error in Rust module factory:', error);
  
  // Analyze the error in detail
  debugLog('Error type:', typeof error);
  debugLog('Error name:', error?.name);
  debugLog('Error message:', error?.message);
}

// Exit the process explicitly
process.exit(0);