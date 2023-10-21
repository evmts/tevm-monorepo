import { validateUserConfig } from './validateUserConfig.js'
import { fail, map } from 'effect/Effect'

export class NoPluginFoundError extends Error {
	_tag = 'NoPluginFoundError'
}

/**
 * @typedef {NoPluginFoundError} GetEvmtsConfigFromTsConfigError
 */

/**
 * @param {import("./loadTsConfig.js").TsConfig} tsConfig
 * @returns {import("effect/Effect").Effect<never, NoPluginFoundError, import("../types.js").CompilerConfig>}
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
		return fail(
			new NoPluginFoundError(
				'No plugin with name @evmts/ts-plugin found in tsconfig.compilerOptions.plugins',
			),
		)
	}
	const configEffect = validateUserConfig(() => plugin)
	if (tsConfig.compilerOptions.baseUrl) {
		const { baseUrl } = tsConfig.compilerOptions
		return map(configEffect, (config) => ({
			...config,
			libs: [...new Set([baseUrl, ...(config.libs ?? [])])],
		}))
	}
	return configEffect
}
