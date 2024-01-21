import { mergeConfigs, withDefaults } from './config/index.js'
import { loadFoundryConfig } from './foundry/index.js'
import {
	InvalidJsonConfigError,
	loadJsonConfig,
} from './json/loadJsonConfig.js'
import { getTevmConfigFromTsConfig, loadTsConfig } from './tsconfig/index.js'
import { logAllErrors } from '@tevm/effect'
import {
	all,
	catchTags,
	fail,
	flatMap,
	logDebug,
	tap,
	tapError,
} from 'effect/Effect'

/**
 * @typedef {import("./tsconfig/index.js").LoadTsConfigError | import("./tsconfig/index.js").GetTevmConfigFromTsConfigError | import("./foundry/index.js").LoadFoundryConfigError | InvalidJsonConfigError} LoadConfigErrorType
 */

/**
 * Error class for {@link loadConfig}
 */
export class LoadConfigError extends Error {
	/**
	 * @type {LoadConfigError['_tag']}
	 * @override
	 */
	name
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
		this.name = underlyingError._tag
	}
}

/**
 * Loads an Tevm config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadConfigError, import("./types.js").ResolvedCompilerConfig>}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {loadConfig} from '@tevm/config'
 *
 * runPromise(loadConfig('./tsconfig.json')).pipe(
 *   tap(config => console.log(config))
 * )
 * ```
 */
export const loadConfig = (configFilePath) => {
	const tsConfig = logDebug(
		`loadConfig: loading tsConfig at ${JSON.stringify(configFilePath)}`,
	).pipe(flatMap(() => loadTsConfig(configFilePath)))
	const userConfig = logDebug(
		`loadConfig: loading userConfig at ${JSON.stringify(configFilePath)}`,
	).pipe(
		flatMap(() => loadJsonConfig(configFilePath)),
		catchTags({
			// for backwards compatibility attempt to read config from tsconfig
			FailedToReadConfigError: (e) =>
				tsConfig.pipe(
					flatMap((tsConfig) =>
						getTevmConfigFromTsConfig(tsConfig, configFilePath),
					),
					catchTags({
						// if there is no fallback config we want to throw the original error
						NoPluginInTsConfigFoundError: () => fail(e),
						LoadTsConfigError: () => fail(e),
					}),
				),
		}),
	)
	const foundryConfig = flatMap(userConfig, (userConfig) => {
		return loadFoundryConfig(userConfig.foundryProject, configFilePath)
	})
	/**
	 * @param {LoadConfigErrorType} error
	 * @returns {import("effect/Effect").Effect<never, LoadConfigError, never>}
	 */
	const handleError = (error) => {
		return fail(new LoadConfigError(configFilePath, error))
	}
	return all([userConfig, foundryConfig]).pipe(
		tap(([userConfig, foundryConfig]) =>
			logDebug(
				`loadConfig: Config read CompilerConfigs ${JSON.stringify({
					userConfig,
					foundryConfig,
				})}`,
			),
		),
		flatMap(mergeConfigs),
		tap((mergedConfigs) =>
			logDebug(
				`loadConfig: Config read CompilerConfigs ${JSON.stringify({
					mergedConfigs,
				})}`,
			),
		),
		flatMap(withDefaults),
		tapError(logAllErrors),
		catchTags({
			ConfigFnThrowError: handleError,
			FailedToReadConfigError: handleError,
			FoundryConfigError: handleError,
			FoundryNotFoundError: handleError,
			InvalidConfigError: handleError,
			InvalidRemappingsError: handleError,
			ParseJsonError: handleError,
		}),
		tap((config) =>
			logDebug(`loadConfig: Config loaded ${JSON.stringify({ config })}`),
		),
	)
}
