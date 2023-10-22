import { getEvmtsConfigFromTsConfig } from './utils/getEvmtsConfigFromTsConfig.js'
import { loadFoundryConfig } from './utils/loadFoundryConfig.js'
import { loadTsConfig } from './utils/loadTsConfig.js'
import { mergeConfigs } from './utils/mergeConfigs.js'
import { tapLogAllErrors } from './utils/tapLogAllErrors.js'
import { withDefaults } from './utils/withDefaults.js'
import { all, catchAll, fail, flatMap } from 'effect/Effect'

/**
 * @typedef {import("./utils/loadTsConfig.js").LoadTsConfigError | import("./utils/getEvmtsConfigFromTsConfig.js").GetEvmtsConfigFromTsConfigError | import("./utils/loadFoundryConfig.js").LoadFoundryConfigError} LoadConfigErrorType
 */

/**
 * Error class for {@link defineConfig}
 */
export class LoadConfigError extends Error {
	/**
	 * @type {LoadConfigErrorType['_tag']}
	 **/
	_tag
	/**
	 * @param {string} configFilePath
	 * @param {LoadConfigErrorType} underlyingError
	 **/
	constructor(configFilePath, underlyingError) {
		super(
			`${underlyingError._tag}: Unable load config from ${configFilePath}
${underlyingError.message}`,
			{ cause: underlyingError.cause },
		)
		this._tag = underlyingError._tag
	}
}

/**
 * Loads an EVMts config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadConfigError, import("./types.js").ResolvedCompilerConfig>}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {loadConfig} from '@evmts/config'
 *
 * runPromise(loadConfig('./tsconfig.json')).pipe(
 *   tap(config => console.log(config))
 * )
 * ```
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
		tapLogAllErrors(),
		catchAll((e) => fail(new LoadConfigError(configFilePath, e))),
	)
}
