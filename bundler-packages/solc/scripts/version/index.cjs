#!/usr/bin/env node

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const https = require('https');
const os = require('os');

/**
 * Downloads a file from a URL to a local path
 * @param {string} url - The URL to download from
 * @param {string} dest - The local destination path
 * @returns {Promise<void>}
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fsPromises.unlink(dest).catch(() => {});
      reject(err);
    });
    
    file.on('error', (err) => {
      fsPromises.unlink(dest).catch(() => {});
      reject(err);
    });
  });
}

/**
 * Gets the solc version hash for a given version
 * @param {string} version - The version of solc (e.g., '0.8.29')
 * @returns {Promise<string>} - The version hash
 */
async function getSolcVersionHash(version) {
  const tempFile = path.join(os.tmpdir(), `solc-${version}-${Date.now()}.js`);
  const url = `https://esm.sh/solc@${version}?bundle`;
  
  try {
    await downloadFile(url, tempFile);
    
    // Import the downloaded file and get the version
    const solcModule = require(tempFile);
    const solc = solcModule.default;
    
    if (!solc || typeof solc.version !== 'function') {
      throw new Error('Invalid solc module downloaded');
    }
    
    const versionInfo = solc.version();
    
    // Extract commit hash from version string
    // Format is typically like: 0.8.29+commit.abcdef12
    const match = versionInfo.match(/\d+\.\d+\.\d+\+commit\.([a-f0-9]+)/);
    const commitHash = match ? match[1] : null;
    
    if (!commitHash) {
      throw new Error(`Could not extract commit hash from version string: ${versionInfo}`);
    }
    
    const versionHash = `v${version}+commit.${commitHash}`;
    
    return versionHash;
  } finally {
    // Clean up by deleting the temporary file
    try {
      await fsPromises.unlink(tempFile);
    } catch (err) {
      console.error('Failed to delete temporary file:', err);
    }
  }
}

async function main() {
  try {
    if (process.argv.length < 3) {
      console.error('Usage: node index.js <version>');
      process.exit(1);
    }
    
    const version = process.argv[2];
    const versionHash = await getSolcVersionHash(version);
    
    console.log(versionHash);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();