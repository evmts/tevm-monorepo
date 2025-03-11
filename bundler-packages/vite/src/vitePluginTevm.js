import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'

/**
 * Creates a Vite plugin for Tevm that enables direct Solidity imports in JavaScript
 * and TypeScript code.
 *
 * This plugin integrates with Vite to transform imports of .sol files into JavaScript
 * modules that export Tevm Contract instances. These instances include the contract's ABI,
 * bytecode, and type information, allowing you to interact with Ethereum smart contracts
 * in a type-safe way directly in your Vite-powered applications.
 *
 * @returns {import('vite').Plugin} A Vite plugin that handles Solidity imports
 *
 * @example
 * // Basic Configuration - Add the plugin to your Vite configuration
 * // vite.config.js
 * import { defineConfig } from 'vite'
 * import { vitePluginTevm } from '@tevm/vite'
 *
 * export default defineConfig({
 *   plugins: [vitePluginTevm()],
 * })
 *
 * @example
 * // TypeScript Configuration - For full TypeScript support
 * // Add to tsconfig.json:
 * // {
 * //   "compilerOptions": {
 * //     "plugins": [{ "name": "tevm/ts-plugin" }]
 * //   }
 * // }
 *
 * @example
 * // How Solidity imports work - Generated module example
 * import { createContract } from '@tevm/contract'
 *
 * export const ERC20 = createContract({
 *   name: 'ERC20',
 *   humanReadableAbi: [
 *     'function name() view returns (string)',
 *     'function symbol() view returns (string)',
 *     // other functions...
 *   ],
 *   bytecode: '0x...',
 *   deployedBytecode: '0x...',
 * })
 *
 * The plugin supports Vite's HMR, so when you edit your Solidity files, your
 * application will update without a full reload if possible.
 *
 * @see {@link https://tevm.sh/learn/solidity-imports | Tevm Solidity Import Documentation}
 * @see {@link https://vitejs.dev/guide/api-plugin.html | Vite Plugin API}
 */
export const vitePluginTevm = createUnplugin(tevmUnplugin).vite
