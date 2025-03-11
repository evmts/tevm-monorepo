import type { unplugin } from './unplugin.js'

/**
 * Constructor interface for the Tevm Webpack plugin.
 *
 * This interface defines the constructor signature for the WebpackPluginTevm class,
 * which enables direct Solidity imports in JavaScript and TypeScript code within
 * Webpack projects.
 *
 * @example
 * ```typescript
 * // webpack.config.ts
 * import { WebpackPluginTevm } from '@tevm/webpack'
 * import { Configuration } from 'webpack'
 *
 * const config: Configuration = {
 *   entry: './src/index.ts',
 *   output: {
 *     filename: 'bundle.js',
 *     path: __dirname + '/dist',
 *   },
 *   plugins: [
 *     new WebpackPluginTevm()
 *   ]
 * }
 *
 * export default config
 * ```
 */
export interface TevmWebpackPluginConstructor {
	/**
	 * Creates a new instance of the Tevm Webpack plugin.
	 *
	 * @param options - Optional configuration options for the plugin
	 * @returns A webpack plugin instance that handles Solidity imports
	 */
	new (options?: Parameters<typeof unplugin.webpack>[0]): ReturnType<typeof unplugin.webpack>
}
