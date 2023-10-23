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
 * @returns {import("effect/Effect").Effect<never, GetEvmtsConfigFromTsConfigError, import("../types.js").CompilerConfig>}
 * @internal
 */
export const getEvmtsConfigFromTsConfig = (tsConfig) => {
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
	const configEffect = validateUserConfig(() => plugin)
	if (tsConfig.compilerOptions.baseUrl) {
		const { baseUrl } = tsConfig.compilerOptions
		return map(configEffect, (config) => ({
			...config,
			libs: [...new Set([baseUrl, ...(config.libs ?? [])])],
		}))
	}
	return tap(configEffect, (config) => {
		return logDebug(`getting config from tsconfig: 
  tsconfig: ${JSON.stringify(config)}
  result: ${JSON.stringify(config)}`)
	})
}
