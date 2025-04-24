#!/usr/bin/env node

/**
 * This script renames all .md files to .mdx in the pages directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'pages');

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.md')) {
      const newPath = filePath.replace(/\.md$/, '.mdx');
      console.log(`Renaming ${filePath} to ${newPath}`);
      fs.renameSync(filePath, newPath);
    }
  }
}

// Process all directories in pages
processDirectory(PAGES_DIR);
console.log('All .md files have been renamed to .mdx!');