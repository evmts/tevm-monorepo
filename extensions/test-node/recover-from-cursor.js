#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const cursorHistoryDir = path.join(process.env.HOME, 'Library/Application Support/Cursor/User/History');
const targetProjectPath = '/Users/polarzero/code/tevm/tevm-monorepo/extensions/test-node/src/test/methods/';

// Map to store method -> most recent file info
const methodFiles = new Map();

// Read all directories in cursor history
const historyDirs = fs.readdirSync(cursorHistoryDir);

console.log(`Scanning ${historyDirs.length} Cursor history directories...\n`);

historyDirs.forEach(dir => {
  const dirPath = path.join(cursorHistoryDir, dir);
  const entriesPath = path.join(dirPath, 'entries.json');
  
  if (!fs.existsSync(entriesPath)) return;
  
  try {
    const entriesContent = fs.readFileSync(entriesPath, 'utf-8');
    const entriesData = JSON.parse(entriesContent);
    
    // Check if this is a test method file from our project
    if (entriesData.resource && entriesData.resource.includes(targetProjectPath)) {
      // Extract method name from file path
      const resourcePath = entriesData.resource.replace('file://', '');
      const fileName = path.basename(resourcePath);
      const methodMatch = fileName.match(/^(eth_\w+)\.spec\.ts$/);
      
      if (methodMatch) {
        const methodName = methodMatch[1];
        
        // Find the most recent entry
        let mostRecentEntry = null;
        let mostRecentTimestamp = 0;
        
        entriesData.entries.forEach(entry => {
          if (entry.timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = entry.timestamp;
            mostRecentEntry = entry;
          }
        });
        
        if (mostRecentEntry) {
          const filePath = path.join(dirPath, mostRecentEntry.id);
          
          if (fs.existsSync(filePath)) {
            // Check if this is more recent than what we already have
            if (!methodFiles.has(methodName) || mostRecentTimestamp > methodFiles.get(methodName).timestamp) {
              methodFiles.set(methodName, {
                methodName,
                filePath,
                timestamp: mostRecentTimestamp,
                date: new Date(mostRecentTimestamp),
                entryId: mostRecentEntry.id,
                historyDir: dir
              });
            }
          }
        }
      }
    }
  } catch (error) {
    // Skip invalid JSON files
  }
});

console.log(`Found ${methodFiles.size} eth_ method files in Cursor history:\n`);

// Sort by method name
const sortedMethods = Array.from(methodFiles.values()).sort((a, b) => a.methodName.localeCompare(b.methodName));

sortedMethods.forEach((fileInfo, index) => {
  console.log(`${index + 1}. ${fileInfo.methodName}`);
  console.log(`   File: ${fileInfo.entryId}`);
  console.log(`   Modified: ${fileInfo.date.toISOString()}`);
  console.log(`   History Dir: ${fileInfo.historyDir}`);
  console.log(`   Path: ${fileInfo.filePath}`);
  
  // Check if file exists and show a preview
  if (fs.existsSync(fileInfo.filePath)) {
    const content = fs.readFileSync(fileInfo.filePath, 'utf-8');
    const lines = content.split('\n');
    console.log(`   Size: ${content.length} bytes, ${lines.length} lines`);
    console.log(`   Preview: ${lines[0]?.substring(0, 80)}...`);
  } else {
    console.log(`   ⚠️  File not found at path`);
  }
  console.log('');
});

// List all methods found
console.log('Methods found:', Array.from(methodFiles.keys()).sort().join(', '));

// Option to restore files
console.log('\n' + '='.repeat(60));
console.log('RECOVERY OPTIONS:');
console.log('1. To examine a specific file:');
console.log('   cat "' + sortedMethods[0]?.filePath + '"');
console.log('\n2. To restore all files, uncomment the restore section below and re-run');

// Uncomment this section to actually restore the files
/*
console.log('\n--- RESTORING FILES ---');
const targetDir = path.join(process.cwd(), 'src/test/methods');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

methodFiles.forEach((fileInfo, methodName) => {
  const targetPath = path.join(targetDir, `${methodName}.spec.ts`);
  
  if (fs.existsSync(fileInfo.filePath)) {
    console.log(`Copying ${methodName} → ${targetPath}`);
    fs.copyFileSync(fileInfo.filePath, targetPath);
  } else {
    console.log(`⚠️  Skipping ${methodName} - source file not found`);
  }
});
console.log('Restoration complete!');
*/