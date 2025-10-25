/**
 * @module @tevm/requirejs
 *
 * This module provides a RequireJS loader plugin for enabling direct Solidity imports in
 * JavaScript and TypeScript. The plugin integrates with RequireJS's module loading system
 * to automatically compile Solidity contracts and transform them into fully-typed
 * Tevm Contract instances.
 *
 * @example
 * ```javascript
 * // Configure RequireJS
 * requirejs.config({
 *   paths: {
 *     'tevm-sol': 'node_modules/@tevm/requirejs-plugin/dist/requirejsPluginTevm'
 *   }
 * });
 *
 * // Load Solidity contracts
 * define(['tevm-sol!./contracts/Counter.sol'], function(Counter) {
 *   console.log('ABI:', Counter.abi);
 *   console.log('Bytecode:', Counter.bytecode);
 * });
 * ```
 *
 * Once configured, you can load Solidity files as RequireJS modules:
 * ```javascript
 * require(['tevm-sol!./contracts/Counter.sol', 'tevm'], function(Counter, tevm) {
 *   // Access contract metadata
 *   console.log(Counter.abi)
 *
 *   // Use with Tevm
 *   const client = tevm.createMemoryClient()
 *   client.deployContract(Counter).then(deployed => {
 *     return deployed.read.count()
 *   }).then(count => {
 *     console.log('Count:', count)
 *   })
 * });
 * ```
 */

/**
 * Re-exports for advanced usage if needed
 */
export { requirejsFileAccessObject } from './requirejsFileAccessObject.js'
export { requirejsPluginTevm } from './requirejsPluginTevm.js'
