import { mergeConfigs } from './mergeConfigs.js'
import { getEvmtsConfigFromTsConfig } from './utils/getEvmtsConfigFromTsConfig.js'
import { loadFoundryConfig } from './utils/loadFoundryConfig.js'
import { loadTsConfig } from './utils/loadTsConfig.js'
import { withDefaults } from './utils/withDefaults.js'
import { all, flatMap } from 'effect/Effect'

/**
 * @typedef {import("./utils/loadTsConfig.js").LoadTsConfigError | import("./utils/getEvmtsConfigFromTsConfig.js").GetEvmtsConfigFromTsConfigError} LoadConfigError
 */

/**
 * Asyncronously loads an EVMts config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadConfigError, import("./types.js").ResolvedCompilerConfig>}
 */
export const loadConfig = (configFilePath) => {
	const userConfigEffect = loadTsConfig(configFilePath).pipe(
		flatMap(getEvmtsConfigFromTsConfig),
	)
	const foundryConfigEffect = flatMap(userConfigEffect, (userConfig) => {
		return loadFoundryConfig(userConfig.foundryProject, configFilePath)
	})
	return all([userConfigEffect, foundryConfigEffect]).pipe(
		flatMap(mergeConfigs),
		flatMap(withDefaults),
	)
}
