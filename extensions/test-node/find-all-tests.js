#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const recoveredDir = path.join(process.cwd(), 'temp-recovered');

// Read all files in temp-recovered
const files = fs.readdirSync(recoveredDir);

console.log(`Scanning ${files.length} recovered files...\n`);

const testLikeFiles = [];

files.forEach(file => {
  const filePath = path.join(recoveredDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Much broader search - any file that looks like a test
  const hasTestImports = /import.*from\s+['"]vitest['"]/.test(content);
  const hasDescribe = /describe\s*\(/.test(content);
  const hasIt = /it\s*\(/.test(content);
  const hasEthMethod = /eth_\w+/.test(content);
  const hasSpec = /\.spec\.|\.test\./.test(content);
  
  if (hasTestImports || hasDescribe || hasIt || hasEthMethod || hasSpec) {
    const stats = fs.statSync(filePath);
    
    // Try to extract method name from content
    const ethMethodMatch = content.match(/describe\s*\(\s*['"`]([^'"`]+)['"`]/);
    const methodName = ethMethodMatch ? ethMethodMatch[1] : 'unknown';
    
    testLikeFiles.push({
      file: file,
      path: filePath,
      mtime: stats.mtime,
      size: stats.size,
      methodName: methodName,
      hasTestImports,
      hasDescribe,
      hasIt,
      hasEthMethod,
      preview: content.substring(0, 200).replace(/\n/g, ' ')
    });
  }
});

console.log(`Found ${testLikeFiles.length} test-like files:\n`);

// Sort by modification time (most recent first)
testLikeFiles.sort((a, b) => b.mtime - a.mtime);

testLikeFiles.forEach((f, index) => {
  console.log(`${index + 1}. File: ${f.file}`);
  console.log(`   Method: ${f.methodName}`);
  console.log(`   Modified: ${f.mtime.toISOString()}`);
  console.log(`   Size: ${f.size} bytes`);
  console.log(`   Features: ${[
    f.hasTestImports && 'vitest-imports',
    f.hasDescribe && 'describe',
    f.hasIt && 'it',
    f.hasEthMethod && 'eth-methods'
  ].filter(Boolean).join(', ')}`);
  console.log(`   Preview: ${f.preview}...`);
  console.log('');
});

if (testLikeFiles.length > 0) {
  console.log('\nTo examine a specific file, run:');
  console.log('cat temp-recovered/<filename>');
}