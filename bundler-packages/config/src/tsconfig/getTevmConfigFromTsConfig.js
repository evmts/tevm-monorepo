import { validateUserConfig } from '../config/index.js'
import { catchTags, die, fail, logDebug, map, tap } from 'effect/Effect'

/**
 * Error type for {@link getTevmConfigFromTsConfig}
 * @internal
 */
export class NoPluginInTsConfigFoundError extends Error {
	/**
	 * @type {'NoPluginInTsConfigFoundError'}
	 */
	_tag = 'NoPluginInTsConfigFoundError'
}

/**
 * @typedef {NoPluginInTsConfigFoundError | import("../config/index.js").InvalidConfigError } GetTevmConfigFromTsConfigError
 */

/**
 * @param {import("./loadTsConfig.js").TsConfig} tsConfig
 * @param {string} configPath`
 * @returns {import("effect/Effect").Effect<never, GetTevmConfigFromTsConfigError, import("../types.js").CompilerConfig>}
 * @internal
 */
export const getTevmConfigFromTsConfig = (tsConfig, configPath) => {
	if (!tsConfig.compilerOptions?.plugins?.length) {
		return fail(
			new NoPluginInTsConfigFoundError(
				'No compilerOptions.plugins in tsconfig',
			),
		)
	}
	const plugin =
		/**
		 * @type {import("../types.js").CompilerConfig | undefined}
		 */
		(
			tsConfig.compilerOptions.plugins.find(
				(/** @type {any}*/ plugin) => plugin.name === '@tevm/ts-plugin',
			)
		)
	if (!plugin) {
		return fail(new NoPluginInTsConfigFoundError())
	}
	const { baseUrl, paths } = tsConfig.compilerOptions
	const pathRemappings = Object.fromEntries(
		Object.entries(paths ?? {}).map(([key, value]) => [
			key.replace(/\/\*$/, '/'),
			value?.[0]?.replace(/^\./, configPath).replace(/\/\*$/, '/') ?? '',
		]),
	)
	return validateUserConfig(() => plugin).pipe(
		catchTags({
			// this can't happen we can cean this up via validateUserConfig taking a config instead of a configFn
			ConfigFnThrowError: (e) => die(e),
		}),
		map((config) => ({
			...config,
			remappings: {
				...config.remappings,
				...pathRemappings,
			},
		})),
		map((config) =>
			baseUrl
				? {
						...config,
						remappings: {
							...pathRemappings,
							...config.remappings,
						},
						libs: [...new Set([baseUrl, ...(config.libs ?? [])])],
				  }
				: config,
		),
		tap((config) => {
			return logDebug(`getting config from tsconfig:
  tsconfig: ${JSON.stringify(config)}
  result: ${JSON.stringify(config)}`)
		}),
	)
}
