/**
 * @module @tevm/rollup
 *
 * A module that provides a Rollup plugin for enabling direct Solidity imports
 * in JavaScript and TypeScript. This plugin integrates with Rollup to transform
 * imports of .sol files into JavaScript modules with fully typed Tevm Contract instances.
 *
 * @example
 * ```javascript
 * // rollup.config.js
 * import { defineConfig } from 'rollup'
 * import { rollupPluginTevm } from '@tevm/rollup'
 *
 * export default defineConfig({
 *   input: 'src/index.js',
 *   output: {
 *     dir: 'dist',
 *     format: 'esm',
 *   },
 *   plugins: [rollupPluginTevm()],
 * })
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

export { rollupPluginTevm } from './rollupPluginTevm.js'
