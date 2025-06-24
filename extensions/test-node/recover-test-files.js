#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

// Extract all method names from the switch statement in isCachedJsonRpcMethod
const ethMethods = [
  'eth_accounts',
  'eth_blobBaseFee',
  'eth_blockNumber',
  'eth_chainId',
  'eth_call',
  'eth_coinbase',
  'eth_createAccessList',
  'eth_estimateGas',
  'eth_feeHistory',
  'eth_gasPrice',
  'eth_getBalance',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getCode',
  'eth_getFilterChanges',
  'eth_getFilterLogs',
  'eth_getLogs',
  'eth_getProof',
  'eth_getStorageAt',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionByHash',
  'eth_getTransactionCount',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_maxPriorityFeePerGas',
  'eth_newBlockFilter',
  'eth_newFilter',
  'eth_newPendingTransactionFilter',
  'eth_protocolVersion',
  'eth_sendRawTransaction',
  'eth_sendTransaction',
  'eth_simulateV1',
  'eth_sign',
  'eth_signTransaction',
  'eth_syncing',
  'eth_uninstallFilter',
  'eth_estimateUserOperationGas',
  'eth_getUserOperationByHash',
  'eth_getUserOperationReceipt',
  'eth_sendUserOperation',
  'eth_supportedEntryPoints'
];

const recoveredDir = path.join(process.cwd(), 'temp-recovered');
const targetDir = path.join(process.cwd(), 'src/test/methods');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Track found files
const foundFiles = new Map(); // method -> array of {file, timestamp}

// Read all files in temp-recovered
const files = fs.readdirSync(recoveredDir);

files.forEach(file => {
  const filePath = path.join(recoveredDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if it imports 'describe' from 'vitest'
  const hasVitestDescribe = /import\s+.*\bdescribe\b.*from\s+['"]vitest['"]/.test(content);

  if (!hasVitestDescribe) return;

  // Check for eth_ methods in describe blocks
  ethMethods.forEach(method => {
    // Look for describe('method' or describe("method"
    const describePattern = new RegExp(`describe\\s*\\(\\s*['"\`]${method}['"\`]`, 'i');

    if (describePattern.test(content)) {
      // Get file stats to find the most recent
      const stats = fs.statSync(filePath);

      if (!foundFiles.has(method)) {
        foundFiles.set(method, []);
      }

      foundFiles.get(method).push({
        file: file,
        path: filePath,
        mtime: stats.mtime
      });
    }
  });
});

console.log(`\nFound ${foundFiles.size} unique eth_ method test files`);
console.log('Methods found:', Array.from(foundFiles.keys()).sort().join(', '));

// Show details and prepare for recovery
foundFiles.forEach((files, method) => {
  console.log(`\n${method}:`);

  // Sort by modification time (most recent first)
  files.sort((a, b) => b.mtime - a.mtime);

  files.forEach((f, index) => {
    console.log(`  ${index + 1}. ${f.file} (modified: ${f.mtime.toISOString()})`);
  });

  // The most recent one would be files[0]
  const mostRecent = files[0];
  const targetPath = path.join(targetDir, `${method}.spec.ts`);

  console.log(`  → Would restore: ${mostRecent.file} to ${targetPath}`);
});

// Uncomment to actually restore files
/*
console.log('\n--- RESTORING FILES ---');
foundFiles.forEach((files, method) => {
  const mostRecent = files[0];
  const targetPath = path.join(targetDir, `${method}.spec.ts`);

  console.log(`Copying ${mostRecent.file} → ${method}.spec.ts`);
  fs.copyFileSync(mostRecent.path, targetPath);
});
console.log('Done!');
*/

console.log('\n\nTo restore these files, uncomment the restore section at the bottom of the script and run again.');