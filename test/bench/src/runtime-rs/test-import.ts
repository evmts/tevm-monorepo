// Simple test file to check if we can import the runtime-rs package
import * as fs from 'fs';
import path from 'path';

// Log the location of the runtime-rs package in the monorepo
const runtimeRsPath = path.resolve('/Users/williamcory/tevm/main/bundler-packages/runtime-rs');
console.log('Runtime-rs path:', runtimeRsPath);
console.log('Exists:', fs.existsSync(runtimeRsPath));

// List files in the runtime-rs directory
console.log('Files in runtime-rs directory:');
const files = fs.readdirSync(runtimeRsPath);
console.log(files);

// Log the content of the package.json
const packageJsonPath = path.join(runtimeRsPath, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log('Package.json:', packageJson);
}

// Try to directly require the package (this might fail)
try {
  // This might not work in ESM context, but we're trying anyway
  const runtimeRs = require('@tevm/runtime-rs');
  console.log('Successfully imported @tevm/runtime-rs:', Object.keys(runtimeRs));
} catch (error) {
  console.error('Error importing @tevm/runtime-rs:', error.message);
}

// Try alternative import (directly from the package path)
try {
  const directImport = require(path.join(runtimeRsPath, 'index.js'));
  console.log('Successfully imported directly:', Object.keys(directImport));
} catch (error) {
  console.error('Error importing directly:', error.message);
}

console.log('Test import completed');