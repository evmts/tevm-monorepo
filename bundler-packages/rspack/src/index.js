/**
 * @module @tevm/rspack
 *
 * A module that provides an Rspack plugin for enabling direct Solidity imports
 * in JavaScript and TypeScript. This plugin integrates with Rspack to transform
 * imports of .sol files into JavaScript modules with fully typed Tevm Contract instances.
 *
 * [Rspack](https://www.rspack.dev/) is a Rust-based JavaScript bundler that's highly
 * compatible with Webpack but offers significantly better performance for large projects.
 *
 * @example
 * ```javascript
 * // rspack.config.js
 * import { rspackPluginTevm } from '@tevm/rspack'
 *
 * module.exports = {
 *   entry: './src/index.js',
 *   output: {
 *     filename: 'bundle.js',
 *     path: __dirname + '/dist',
 *   },
 *   plugins: [
 *     rspackPluginTevm()
 *   ]
 * }
 * ```
 *
 * Once configured, you can import Solidity files directly:
 * ```typescript
 * // src/index.ts
 * import { Counter } from './contracts/Counter.sol'
 *
 * // Use the contract with full type safety
 * console.log(Counter.abi)
 * ```
 */

export { rspackPluginTevm } from './rspackPluginTevm.js'
