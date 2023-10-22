import { loadFoundryConfig } from './utils/loadFoundryConfig.js'
import { mergeConfigs } from './utils/mergeConfigs.js'
import { validateUserConfig } from './utils/validateUserConfig.js'
import { withDefaults } from './utils/withDefaults.js'
import { all, flatMap } from 'effect/Effect'

/**
 * Used in evmts.config.ts to create a config
 * @type {import("./types.js").DefineConfig}
 * @example
 * ```ts
 * import { defineConfig } from '@evmts/ts-plugin'
 *
 * export default defineConfig(() => ({
 * 	lib: ['lib'],
 * 	remappings: {
 * 	  'foo': 'foo/bar'
 * 	}
 * })
 */
export const defineConfig = (configFactory) => ({
	configFn: (configFilePath) => {
		const config = validateUserConfig(configFactory)
		const foundryConfig = flatMap(config, ({ foundryProject }) =>
			loadFoundryConfig(foundryProject, configFilePath),
		)
		return all([config, foundryConfig]).pipe(
			flatMap(mergeConfigs),
			flatMap(withDefaults),
		)
	},
})
