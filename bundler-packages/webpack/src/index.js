/**
 * @module @tevm/webpack
 *
 * A module that provides a Webpack plugin for enabling direct Solidity imports
 * in JavaScript and TypeScript. This plugin integrates with Webpack to transform
 * imports of .sol files into JavaScript modules with fully typed Tevm Contract instances.
 *
 * @example
 * ```javascript
 * // webpack.config.js
 * const { WebpackPluginTevm } = require('@tevm/webpack')
 *
 * module.exports = {
 *   entry: './src/index.js',
 *   output: {
 *     filename: 'bundle.js',
 *     path: __dirname + '/dist',
 *   },
 *   plugins: [
 *     new WebpackPluginTevm()
 *   ]
 * }
 * ```
 *
 * Once configured, you can import Solidity files directly:
 * ```typescript
 * // src/index.ts
 * import { Counter } from './contracts/Counter.sol'
 * import { createMemoryClient } from 'tevm'
 *
 * // Use the contract with full type safety
 * const client = createMemoryClient()
 * // ... work with the contract
 * ```
 */

export { WebpackPluginTevm } from './WebpackPluginTevm.js'
