/**
 * @module @tevm/bundler-cache
 *
 * The bundler-cache module provides a filesystem-based caching system for Tevm
 * bundlers. It enables efficient caching of Solidity compilation artifacts,
 * generated TypeScript definitions, and JavaScript modules to improve build
 * performance and reduce unnecessary recompilations.
 *
 * This module is primarily used internally by Tevm bundler packages (@tevm/bun,
 * @tevm/webpack, @tevm/vite, etc.) to implement caching, but can also be used
 * directly in custom build systems.
 *
 * @example
 * ```javascript
 * import { createCache } from '@tevm/bundler-cache'
 * import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
 * import { mkdir, readFile, stat, writeFile } from 'fs/promises'
 *
 * // Create a file access object with required methods
 * const fs = {
 *   existsSync,
 *   exists: async (path) => existsSync(path),
 *   readFile: (path, encoding) => readFile(path, { encoding }),
 *   readFileSync,
 *   writeFileSync,
 *   writeFile,
 *   statSync,
 *   stat,
 *   mkdirSync,
 *   mkdir
 * }
 *
 * // Create a cache instance
 * const cache = createCache(
 *   '.tevm',        // Cache directory
 *   fs,             // File access object
 *   process.cwd()   // Current working directory
 * )
 *
 * // Read cached artifacts
 * const artifacts = await cache.readArtifacts('./contracts/Counter.sol')
 *
 * // Write artifacts to cache
 * await cache.writeArtifacts('./contracts/Counter.sol', compiledContracts)
 * ```
 *
 * @typedef {import('./types.js').Cache} Cache
 * @typedef {import('./types.js').CachedItem} CachedItem
 * @typedef {import('./types.js').FileAccessObject} FileAccessObject
 */

export { createCache } from './createCache.js'
