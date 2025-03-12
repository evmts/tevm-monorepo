/**
 * @module @tevm/vite
 *
 * A module that provides a Vite plugin for enabling direct Solidity imports
 * in JavaScript and TypeScript. This plugin integrates with Vite to transform
 * imports of .sol files into JavaScript modules with fully typed Tevm Contract instances.
 *
 * @example
 * ```javascript
 * // vite.config.js
 * import { defineConfig } from 'vite'
 * import { vitePluginTevm } from '@tevm/vite'
 *
 * export default defineConfig({
 *   plugins: [vitePluginTevm()],
 * })
 * ```
 *
 * Once configured, you can import Solidity files directly in your application:
 * ```typescript
 * // src/App.tsx
 * import { Counter } from './contracts/Counter.sol'
 * import { createMemoryClient } from 'tevm'
 *
 * function App() {
 *   // Use the contract with full type safety
 *   const client = createMemoryClient()
 *   // ...
 * }
 * ```
 */

export { vitePluginTevm } from './vitePluginTevm.js'
