import path from 'node:path'
import { catchTag, die, fail, logDebug, map, tap } from 'effect/Effect'
import { validateUserConfig } from '../config/index.js'

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
 * @returns {import("effect/Effect").Effect<import("../types.js").CompilerConfig, GetTevmConfigFromTsConfigError, never>}
 * @internal
 */
export const getTevmConfigFromTsConfig = (tsConfig, configPath) => {
	if (!tsConfig.compilerOptions?.plugins?.length) {
		return fail(new NoPluginInTsConfigFoundError('No compilerOptions.plugins in tsconfig'))
	}
	const plugin =
		/**
		 * @type {import("../types.js").CompilerConfig | undefined}
		 */
		(tsConfig.compilerOptions.plugins.find((/** @type {any}*/ plugin) => plugin.name === '@tevm/ts-plugin'))
	if (!plugin) {
		return fail(new NoPluginInTsConfigFoundError())
	}
	const { baseUrl, paths } = tsConfig.compilerOptions
	const configDir = path.resolve(configPath)
	const baseDir = baseUrl ? path.resolve(configDir, baseUrl) : configDir
	const pathRemappings = Object.fromEntries(
		Object.entries(paths ?? {}).map(([key, value]) => [
			key.replace(/\/\*$/, '/'),
			value?.[0] ? `${path.resolve(baseDir, value[0].replace(/\/\*$/, '')).replace(/\\/g, '/')}/` : '',
		]),
	)
	return validateUserConfig(() => plugin).pipe(
		catchTag('ConfigFnThrowError', (e) => die(e)),
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
						libs: [...new Set([baseDir, ...(config.libs ?? [])])],
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
