import {
	mergeConfigs,
	validateUserConfig,
	withDefaults,
} from './config/index.js'
import { loadFoundryConfig } from './foundry/index.js'
import { all, catchTags, fail, flatMap, logDebug, tap } from 'effect/Effect'

/**
 * Error class for {@link defineConfig}
 */
export class DefineConfigError extends Error {
	/**
	 * @type {import("./types.js").DefineConfigErrorType['_tag']}
	 * @override
	 */
	name
	/**
	 * @type {import("./types.js").DefineConfigErrorType['_tag']}
	 **/
	_tag
	/**
	 * @param {string} configFilePath
	 * @param {import("./types.js").DefineConfigErrorType} underlyingError
	 **/
	constructor(configFilePath, underlyingError) {
		super(
			`${underlyingError._tag}: Unable to resolve EVMts CompilerConfig at ${configFilePath}
${underlyingError.message}`,
			{ cause: underlyingError.cause },
		)
		this._tag = underlyingError._tag
		this.name = underlyingError._tag
	}
}

/**
 * Typesafe way to create an EVMts CompilerConfig
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
 * ```
 */
export const defineConfig = (configFactory) => ({
	configFn: (configFilePath) => {
		const config = validateUserConfig(configFactory)
		const foundryConfig = flatMap(config, ({ foundryProject }) =>
			loadFoundryConfig(foundryProject, configFilePath),
		)
		/**
		 * @param {import("./types.js").DefineConfigErrorType} error
		 * @returns {import("effect/Effect").Effect<never, DefineConfigError, never>}
		 */
		const handleError = (error) => {
			return fail(new DefineConfigError(configFilePath, error))
		}
		return all([config, foundryConfig]).pipe(
			tap(([userConfig, foundryConfig]) =>
				logDebug(
					`defineConfig: Config read CompilerConfigs ${JSON.stringify({
						userConfig,
						foundryConfig,
					})}`,
				),
			),
			flatMap(mergeConfigs),
			tap((mergedConfigs) =>
				logDebug(
					`defineConfig: MergedConfigs ${JSON.stringify({ mergedConfigs })}`,
				),
			),
			flatMap(withDefaults),
			catchTags({
				InvalidRemappingsError: handleError,
				InvalidConfigError: handleError,
				FoundryNotFoundError: handleError,
				FoundryConfigError: handleError,
				ConfigFnThrowError: handleError,
			}),
			tap((config) =>
				logDebug(
					`defineConfig: Added defaults. Config read ${JSON.stringify({
						config,
					})}`,
				),
			),
		)
	},
})
