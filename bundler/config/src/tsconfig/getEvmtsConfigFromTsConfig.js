import { validateUserConfig } from '../config/index.js'
import { fail, logDebug, map, tap } from 'effect/Effect'

/**
 * Error type for {@link getEvmtsConfigFromTsConfig}
 * @internal
 */
export class NoPluginFoundError extends Error {
	/**
	 * @type {'NoPluginFoundError'}
	 */
	_tag = 'NoPluginFoundError'
}

/**
 * @typedef {NoPluginFoundError | import("../config/index.js").ValidateUserConfigError } GetEvmtsConfigFromTsConfigError
 */

/**
 * @param {import("./loadTsConfig.js").TsConfig} tsConfig
 * @param {string} configPath`
 * @returns {import("effect/Effect").Effect<never, GetEvmtsConfigFromTsConfigError, import("../types.js").CompilerConfig>}
 * @internal
 */
export const getEvmtsConfigFromTsConfig = (tsConfig, configPath) => {
	if (!tsConfig.compilerOptions?.plugins?.length) {
		return fail(
			new NoPluginFoundError('No compilerOptions.plugins in tsconfig'),
		)
	}
	const plugin =
		/**
		 * @type {import("../types.js").CompilerConfig | undefined}
		 */
		(
			tsConfig.compilerOptions.plugins.find(
				(/** @type {any}*/ plugin) => plugin.name === '@evmts/ts-plugin',
			)
		)
	if (!plugin) {
		return fail(new NoPluginFoundError())
	}
	const { baseUrl, paths } = tsConfig.compilerOptions
	const pathRemappings = Object.fromEntries(
		Object.entries(paths ?? {}).map(([key, value]) => [
			key.replace(/\/\*$/, '/'),
			value?.[0]?.replace(/^\./, configPath).replace(/\/\*$/, '/') ?? '',
		]),
	)
	return validateUserConfig(() => plugin).pipe(
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
