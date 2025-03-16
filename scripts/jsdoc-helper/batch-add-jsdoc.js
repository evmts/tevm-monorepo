#!/usr/bin/env node

/**
 * A utility script to batch add JSDoc comments to multiple files
 * 
 * Usage: 
 * node scripts/jsdoc-helper/batch-add-jsdoc.js [directory]
 * 
 * Example:
 * node scripts/jsdoc-helper/batch-add-jsdoc.js packages/state
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Default to project root if no directory specified
const searchDir = process.argv[2] || '.';

// Colors for console output
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
};

/**
 * Find all JS and TS files in the given directory that are missing JSDoc
 */
function findFilesWithMissingJSDoc(dir) {
  console.log(`${COLORS.CYAN}Finding files with missing JSDoc in ${dir}...${COLORS.RESET}`);
  
  try {
    // Files/directories to exclude
    const EXCLUDE_PATTERNS = [
      '.d.ts$',
      '.spec.ts$',
      '.spec.js$',
      '.test.ts$',
      '.test.js$',
      'dist/',
      'node_modules/',
      '.git/',
      'coverage/',
    ];
    
    // Use find to get all JS and TS files
    const excludeArgs = EXCLUDE_PATTERNS.map(pattern => `-not -path "*${pattern}*"`).join(' ');
    const cmd = `find ${dir} -type f \\( -name "*.js" -o -name "*.ts" \\) ${excludeArgs}`;
    
    const output = execSync(cmd, { encoding: 'utf8' });
    const files = output.split('\n').filter(Boolean);
    
    console.log(`${COLORS.BLUE}Found ${files.length} JS/TS files to check${COLORS.RESET}`);
    
    const filesToFix = [];
    
    // Check each file for missing JSDoc
    for (const file of files) {
      const result = checkFileForMissingJSDoc(file);
      if (result && result.length > 0) {
        filesToFix.push(file);
      }
    }
    
    return filesToFix;
  } catch (error) {
    console.error(`${COLORS.RED}Error finding files:${COLORS.RESET}`, error.message);
    return [];
  }
}

/**
 * Check if a file has exports without JSDoc
 */
function checkFileForMissingJSDoc(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const EXPORT_PATTERNS = [
      /export\s+(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/,
      /export\s+function\s+([a-zA-Z0-9_$]+)/,
      /export\s+class\s+([a-zA-Z0-9_$]+)/,
      /export\s+interface\s+([a-zA-Z0-9_$]+)/,
      /export\s+type\s+([a-zA-Z0-9_$]+)\s*=/,
      /export\s+enum\s+([a-zA-Z0-9_$]+)/,
      /export\s+default\s+function\s+([a-zA-Z0-9_$]+)?/,
      /export\s+default\s+class\s+([a-zA-Z0-9_$]+)?/
    ];
    
    const missingJSDoc = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line matches any export pattern
      for (const pattern of EXPORT_PATTERNS) {
        if (pattern.test(line)) {
          // Check if this export has JSDoc (look up to 5 lines back)
          let hasJSDoc = false;
          for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
            const prevLine = lines[j].trim();
            if (prevLine.includes('*/')) {
              hasJSDoc = true;
              break;
            }
            // If we encounter a non-empty, non-comment line, stop looking
            if (prevLine !== '' && !prevLine.startsWith('//') && !prevLine.startsWith('*')) {
              break;
            }
          }
          
          if (!hasJSDoc) {
            missingJSDoc.push({ line: i + 1, text: line });
            break;
          }
        }
      }
    }
    
    return missingJSDoc.length > 0 ? missingJSDoc : null;
  } catch (error) {
    console.error(`${COLORS.RED}Error checking file ${filePath}:${COLORS.RESET}`, error.message);
    return null;
  }
}

/**
 * Add JSDoc to a file
 */
function addJSDocToFile(filePath) {
  try {
    console.log(`\n${COLORS.MAGENTA}Processing ${filePath}${COLORS.RESET}`);
    
    const addScript = path.join(__dirname, 'add-jsdoc.js');
    const result = execSync(`node ${addScript} "${filePath}"`, { encoding: 'utf8' });
    
    console.log(result);
    return true;
  } catch (error) {
    console.error(`${COLORS.RED}Error adding JSDoc to ${filePath}:${COLORS.RESET}`, error.message);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  const filesToFix = findFilesWithMissingJSDoc(searchDir);
  
  if (filesToFix.length === 0) {
    console.log(`${COLORS.GREEN}No files need JSDoc comments.${COLORS.RESET}`);
    return;
  }
  
  console.log(`${COLORS.YELLOW}Found ${filesToFix.length} files with missing JSDoc.${COLORS.RESET}`);
  console.log(`${COLORS.YELLOW}Processing each file...${COLORS.RESET}`);
  
  let successCount = 0;
  
  for (const file of filesToFix) {
    const success = addJSDocToFile(file);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`\n${COLORS.GREEN}Successfully added JSDoc to ${successCount} of ${filesToFix.length} files.${COLORS.RESET}`);
}

main();