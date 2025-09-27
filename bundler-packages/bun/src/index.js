/**
 * @module @tevm/bun
 *
 * This module provides a Bun plugin for enabling direct Solidity imports in
 * JavaScript and TypeScript. The plugin integrates with Bun's build system to
 * automatically compile Solidity contracts and transform them into fully-typed
 * Tevm Contract instances.
 *
 * @example
 * ```typescript
 * // plugins.ts
 * import { bunPluginTevm } from '@tevm/bun'
 * import { plugin } from 'bun'
 *
 * // Register the plugin with Bun
 * plugin(bunPluginTevm({}))
 * ```
 *
 * Configure in bunfig.toml:
 * ```toml
 * preload = ["./plugins.ts"]
 * ```
 *
 * Once configured, you can import Solidity files directly:
 * ```typescript
 * import { Counter } from './contracts/Counter.sol'
 *
 * // Access contract metadata
 * console.log(Counter.abi)
 *
 * // Use with Tevm
 * const client = createMemoryClient()
 * const deployed = await client.deployContract(Counter)
 * const count = await deployed.read.count()
 * ```
 */

export { file } from './bunFile.js'

/**
 * Re-exports for advanced usage if needed
 */
export { bunFileAccesObject } from './bunFileAccessObject.js'
export { bunPluginTevm } from './bunPluginTevm.js'
