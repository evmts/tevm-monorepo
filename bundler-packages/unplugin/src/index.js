/**
 * @module @tevm/unplugin
 *
 * A module that provides a universal plugin implementation for Tevm's Solidity
 * import functionality. This package serves as the foundation for all build tool
 * plugins in the Tevm ecosystem (Webpack, Vite, Rollup, etc.) by providing a
 * common implementation that can be adapted to each specific build system.
 *
 * The core functionality includes:
 * - Detecting and processing Solidity (.sol) file imports
 * - Compiling Solidity contracts using solc
 * - Generating JavaScript modules with typed Tevm Contract objects
 * - Providing a caching system for compiled contracts
 *
 * @example
 * ```javascript
 * // This module is typically used by build tool plugins, not directly by users
 * import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'
 *
 * // Create a build tool specific plugin (e.g., for webpack)
 * const webpackPlugin = createUnplugin(tevmUnplugin).webpack
 *
 * // Example configuration
 * const plugin = webpackPlugin({
 *   solc: '0.8.20' // Specify solc compiler version
 * })
 * ```
 */

// Export the unplugin implementation for Tevm
export { tevmUnplugin } from './tevmUnplugin.js'

// Re-export the unplugin factory from the unplugin package
export { createUnplugin } from 'unplugin'

// Re-export Solidity compiler version types
export { SolcVersions } from '@tevm/solc'
