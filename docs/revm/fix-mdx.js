#!/usr/bin/env node

/**
 * This script adds frontmatter to MDX files and fixes internal links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'pages');

function getTitleFromContent(content) {
  const match = content.match(/^# (.+)$/m);
  return match ? match[1] : null;
}

function createDescription(title) {
  return `Detailed guide about ${title.toLowerCase()} in REVM (Rust Ethereum Virtual Machine)`;
}

function addFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if frontmatter already exists
  if (content.startsWith('---')) {
    return content;
  }
  
  const title = getTitleFromContent(content);
  
  if (!title) {
    console.warn(`Could not find title in ${filePath}`);
    return content;
  }
  
  const description = createDescription(title);
  
  const frontmatter = `---
title: ${title}
description: ${description}
---

`;

  return frontmatter + content;
}

function fixInternalLinks(content, dirName) {
  // Fix links with pattern [text](./some-file.md)
  let updatedContent = content.replace(
    /\[([^\]]+)\]\(\.\/([^)]+)\.md\)/g, 
    (match, text, file) => {
      const newPath = `/${dirName}/${file}`;
      return `[${text}](${newPath})`;
    }
  );
  
  // Also fix links without ./ prefix
  updatedContent = updatedContent.replace(
    /\[([^\]]+)\]\(([^)./]+)\.md\)/g, 
    (match, text, file) => {
      const newPath = `/${dirName}/${file}`;
      return `[${text}](${newPath})`;
    }
  );
  
  return updatedContent;
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const dirName = path.basename(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      console.log(`Processing ${filePath}...`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      content = addFrontmatter(filePath);
      content = fixInternalLinks(content, dirName);
      
      fs.writeFileSync(filePath, content);
    }
  }
}

// Process all directories in pages
processDirectory(PAGES_DIR);
console.log('All MDX files have been processed!');