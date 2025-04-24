#!/usr/bin/env node

const { execSync } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

// Configuration
const pkgDir = path.join(__dirname, '..', 'pkg')
const distDir = path.join(__dirname, '..', 'dist')

// Ensure the pkg and dist directories exist
if (!fs.existsSync(pkgDir)) {
	fs.mkdirSync(pkgDir, { recursive: true })
}
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true })
}

// Build the Rust WebAssembly module
console.log('Building WASM module...')
try {
	execSync('wasm-pack build --target web --out-dir pkg', {
		cwd: path.join(__dirname, '..'),
		stdio: 'inherit',
	})
	console.log('WASM build successful!')
} catch (error) {
	console.error('WASM build failed:', error)
	process.exit(1)
}

// Make sure the pkg directory contains the WebAssembly module
if (!fs.existsSync(path.join(pkgDir, 'tevm_evm_rs_bg.wasm'))) {
	console.error('WASM file not found after build!')
	process.exit(1)
}

// Copy files to dist directory
console.log('Copying WASM files to dist directory...')
const filesToCopy = ['tevm_evm_rs_bg.wasm', 'tevm_evm_rs.js', 'tevm_evm_rs_bg.js']

filesToCopy.forEach((file) => {
	const src = path.join(pkgDir, file)
	const dest = path.join(distDir, file)

	if (fs.existsSync(src)) {
		fs.copyFileSync(src, dest)
		console.log(`Copied ${file} to dist/`)
	} else {
		console.warn(`Warning: ${file} not found in pkg/ directory`)
	}
})

// Generate loader script
const loaderScript = `
// WASM module loader for tevm-evm-rs
// This file dynamically loads the WASM module

let wasmModule = null;
let loadPromise = null;

/**
 * Load the WASM module
 * @returns {Promise<any>} Promise that resolves to the initialized WASM module
 */
export const loadWasmModule = async () => {
  if (wasmModule !== null) {
    return wasmModule;
  }

  if (loadPromise === null) {
    loadPromise = (async () => {
      try {
        const module = await import('./tevm_evm_rs.js');
        await module.default();
        wasmModule = module;
        return module;
      } catch (err) {
        loadPromise = null; // Reset for next attempt
        throw new Error(\`Failed to load WASM module: \${err.message}\`);
      }
    })();
  }

  return loadPromise;
};

/**
 * Create a new EVM instance
 * @param {any} options - EVM options
 * @returns {Promise<any>} Promise that resolves to an EVM instance
 */
export const createWasmEvm = async (options) => {
  const module = await loadWasmModule();
  return module.create_evm(options);
};
`

fs.writeFileSync(path.join(distDir, 'wasm-loader.js'), loaderScript)
console.log('Generated wasm-loader.js')

console.log('WASM build completed and verified.')
