#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DOCS_PATH = 'zig-out/docs/evm';
const PROJECT_NAME = 'tevm-zig-docs';

// Vercel configuration for WebAssembly support
const VERCEL_CONFIG = {
  headers: [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cross-Origin-Embedder-Policy",
          value: "require-corp"
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin"
        }
      ]
    },
    {
      source: "/(.*\\.wasm)",
      headers: [
        {
          key: "Content-Type",
          value: "application/wasm"
        }
      ]
    }
  ]
};

console.log('📦 Building Zig documentation...');
try {
  execSync('zig build', { stdio: 'inherit' });
  console.log('✅ Zig build completed successfully');
} catch (error) {
  console.error('❌ Zig build failed:', error.message);
  process.exit(1);
}

// Check if docs directory exists
if (!existsSync(DOCS_PATH)) {
  console.error('❌ Docs directory not found after build.');
  process.exit(1);
}

// Check if required files exist
const requiredFiles = ['index.html', 'main.js', 'main.wasm'];
const missingFiles = requiredFiles.filter(file => !existsSync(join(DOCS_PATH, file)));

if (missingFiles.length > 0) {
  console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
  console.error('Please ensure "zig build" completed successfully.');
  process.exit(1);
}

// Create vercel.json in the docs directory
const vercelConfigPath = join(DOCS_PATH, 'vercel.json');
console.log('📝 Creating vercel.json for WebAssembly support...');
writeFileSync(vercelConfigPath, JSON.stringify(VERCEL_CONFIG, null, 2));

console.log(`🚀 Deploying ${DOCS_PATH} to Vercel...`);
try {
  // Deploy to Vercel with production flag
  // --prod deploys to production URL
  // --yes skips confirmation prompts
  // --name sets the project name
  const command = `vercel ${DOCS_PATH} --prod --yes --name ${PROJECT_NAME}`;
  
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
  
  // Clean up vercel.json after deployment
  try {
    execSync(`rm -f ${vercelConfigPath}`);
  } catch {
    // Ignore cleanup errors
  }
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.error('Make sure you have Vercel CLI installed: npm i -g vercel');
  console.error('And you are logged in: vercel login');
  
  // Clean up vercel.json on error
  try {
    execSync(`rm -f ${vercelConfigPath}`);
  } catch {
    // Ignore cleanup errors
  }
  
  process.exit(1);
}