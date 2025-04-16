/**
 * @fileoverview Direct API module for resolutions-rs
 * 
 * This module provides a clean JavaScript interface to the Rust-based
 * resolution functions. It dynamically loads the napi bindings and exposes
 * functions with the same signatures as the JavaScript implementation.
 */

// The native binding will be loaded dynamically when needed
let nativeBinding = null;

/**
 * Asynchronously loads the native binding if it hasn't been loaded already
 * 
 * @returns {Promise<void>}
 */
async function loadNativeBinding() {
  if (nativeBinding) return;
  
  try {
    // Dynamic import to handle ESM
    const module = await import('./index.js');
    nativeBinding = module;
  } catch (err) {
    console.error('Failed to load native Rust binding:', err);
    throw new Error(`Failed to load @tevm/resolutions-rs native module: ${err.message}`);
  }
}

/**
 * Resolves import paths from Solidity code
 * 
 * @param {string} absolutePath - Absolute path to the module file
 * @param {string} rawCode - Raw Solidity source code
 * @param {Object} remappings - Object mapping import prefixes to filesystem paths
 * @param {string[]} libs - Array of library paths to search for imports
 * @returns {Promise<string[]>} - Array of resolved import paths
 */
export async function resolveImports(absolutePath, rawCode, remappings = {}, libs = []) {
  await loadNativeBinding();
  return nativeBinding.resolve_imports_ffi(absolutePath, rawCode, remappings, libs);
}

/**
 * Resolves a single import path
 * 
 * @param {string} importPath - The import path to resolve
 * @param {string} parentDir - The parent directory to resolve from
 * @param {Object} remappings - Object mapping import prefixes to filesystem paths
 * @param {string[]} libs - Array of library paths to search for imports
 * @returns {Promise<string>} - Resolved absolute path
 */
export async function resolveImportPath(importPath, parentDir, remappings = {}, libs = []) {
  await loadNativeBinding();
  return nativeBinding.resolve_import_path_ffi(importPath, parentDir, remappings, libs);
}

/**
 * Creates a module map for a source file and all its imports
 * 
 * @param {string} absolutePath - Absolute path to the module file
 * @param {string} rawCode - Raw Solidity source code
 * @param {Object} remappings - Object mapping import prefixes to filesystem paths
 * @param {string[]} libs - Array of library paths to search for imports
 * @returns {Promise<Object>} - Map of absolute file paths to module information
 */
export async function moduleFactory(absolutePath, rawCode, remappings = {}, libs = []) {
  await loadNativeBinding();
  return nativeBinding.module_factory_ffi(absolutePath, rawCode, remappings, libs);
}

export default {
  resolveImports,
  resolveImportPath,
  moduleFactory
};