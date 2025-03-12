/**
 * @module @tevm/esbuild
 *
 * A module that provides an esbuild plugin for enabling direct Solidity imports
 * in JavaScript and TypeScript. This plugin allows you to import Solidity contracts
 * directly as if they were JavaScript modules, with full type information when used
 * with the TypeScript plugin.
 *
 * @example
 * ```javascript
 * // esbuild.config.js
 * import { esbuildPluginTevm } from '@tevm/esbuild'
 * import { build } from 'esbuild'
 *
 * build({
 *   entryPoints: ['src/index.js'],
 *   outdir: 'dist',
 *   bundle: true,
 *   plugins: [esbuildPluginTevm()],
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
 * console.log(Counter.bytecode)
 * ```
 */

export { esbuildPluginTevm } from './esbuildPluginTevm.js'
