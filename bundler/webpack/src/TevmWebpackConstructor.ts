import type { unplugin } from './unplugin.js'

/**
 * Webpack plugin for tevm. Enables Solidity imports in JavaScript.
 * @example
 * ```typescript
 * ```
 */
export interface TevmWebpackPluginConstructor {
	new (options?: Parameters<typeof unplugin.webpack>[0]): ReturnType<
		typeof unplugin.webpack
	>
}
