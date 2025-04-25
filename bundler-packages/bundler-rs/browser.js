// This file is the entry point for browsers
// It loads the WASM version of the library when used in a browser context

let wasm = null;

try {
  wasm = require('./tevm_bundler_rs.wasi-browser.js');
} catch (e) {
  console.error('Failed to load WASM module', e);
  throw new Error('This module requires WebAssembly support');
}

module.exports = wasm;