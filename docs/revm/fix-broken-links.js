#!/usr/bin/env node

/**
 * This script replaces broken links with "#TODO" in all MDX files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'pages');

// Common patterns for broken links
const brokenLinkPatterns = [
  // Relative link patterns
  /\]\(\.\.\/(revm-examples|intermediate-concepts|expert-reference)\/[^)]+\.md\)/g,
  
  // Path link patterns
  /\]\(\/(beginner-tutorial|intermediate-concepts|examples)\/[^)]+\)/g,
];

function fixBrokenLinks(content) {
  let updatedContent = content;
  
  for (const pattern of brokenLinkPatterns) {
    updatedContent = updatedContent.replace(pattern, '](#TODO)');
  }
  
  return updatedContent;
}

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = fixBrokenLinks(content);
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`- Fixed broken links in ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      processFile(filePath);
    }
  }
}

// Process all directories in pages
processDirectory(PAGES_DIR);
console.log('All MDX files have been processed!');