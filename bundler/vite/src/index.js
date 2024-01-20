import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'

/**
 * Vite plugin for tevm. Enables solidity imports in JavaScript and TypeScript files.
 * @example
 * ```js
 * // vite.config.js
 * import { vitePluginTevm } from '@tevm/vite-plugin-tevm'
 * export default {
 *   plugins: [vitePluginTevm()]
 *   //...
 * }
 * ```
 * For Langauge Service support in your editor, see `tevm/ts-plugin`
 */
export const vitePluginTevm = createUnplugin(tevmUnplugin).vite
