#!/usr/bin/env node

/**
 * This script helps determine the version hash for a specific solc version.
 * It creates a temporary directory, installs the specified solc version,
 * extracts the version hash, and cleans up afterward.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Get the version from command line arguments
const version = process.argv[2];

if (!version) {
  console.error('Please provide a solc version.');
  console.error('Usage: npm run solc:version <version>');
  console.error('Example: npm run solc:version 0.8.29');
  process.exit(1);
}

// Create a temporary directory in the OS temp directory
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'solc-version-'));
console.log(`Created temporary directory: ${tempDir}`);

try {
  // Change to the temporary directory
  process.chdir(tempDir);
  console.log('Initializing npm project...');
  
  // Initialize npm project
  execSync('npm init -y', { stdio: 'ignore' });
  
  // Install the specified solc version
  console.log(`Installing solc@${version}...`);
  execSync(`npm install solc@${version}`, { stdio: 'ignore' });
  
  // Get the version hash
  console.log('Extracting version hash...');
  const versionOutput = execSync('node -e "const solc = require(\'solc\'); console.log(solc.version());"').toString().trim();
  
  // Extract the commit hash
  const match = versionOutput.match(/(\d+\.\d+\.\d+)\+commit\.([0-9a-f]+)/);
  
  if (match) {
    const [, versionNumber, commitHash] = match;
    const formattedVersion = `v${versionNumber}+commit.${commitHash}.js`;
    
    console.log('\nResults:');
    console.log('-'.repeat(50));
    console.log(`Full version string: ${versionOutput}`);
    console.log(`Formatted version:   ${formattedVersion}`);
    console.log('-'.repeat(50));
    console.log('\nUpdate the following in your code:');
    console.log(`1. Add "${versionNumber}" to SolcVersions in src/solcTypes.ts`);
    console.log(`2. Add the release to src/solc.js:`);
    console.log(`   "${versionNumber}": "${formattedVersion}",`);
    console.log(`3. Update solc in package.json to version ${versionNumber}`);
  } else {
    console.error('Could not parse version output:', versionOutput);
    process.exit(1);
  }
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
} finally {
  // Clean up temporary directory
  console.log(`\nCleaning up temporary directory...`);
  process.chdir(path.dirname(tempDir)); // Move out of the directory before deleting it
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Done.');
}