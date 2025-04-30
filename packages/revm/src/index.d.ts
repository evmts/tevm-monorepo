/**
 * @tevm/revm module provides a Rust-based REVM implementation with WASM support
 * for high-performance EVM execution
 * @module
 */

export { createRevm } from './createRevm.js';
export { default } from './createRevm.js';

// Re-export TypeScript types
export type { Revm, EvmCallParams, EvmResult } from './Revm.js';