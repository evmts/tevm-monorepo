import { logDebug, succeed, tap } from 'effect/Effect'

/**
 * The default CompilerConfig
 */
export const defaultConfig = {
	jsonAsConst: [],
	foundryProject: false,
	remappings: {},
	libs: [],
	debug: false,
	cacheDir: '.tevm',
}

/**
 * Merges the given config with the default config into a {@link import("../types.js").ResolvedCompilerConfig}
 * @param {import("../types.js").CompilerConfig} config
 * @returns {import("effect/Effect").Effect<import("../types.js").ResolvedCompilerConfig, never, never>}
 * @example
 * ```ts
 * const userConfig = { remappings: { key1: 'value1' }, libs: ['lib1'] };
 * const resolvedConfig = withDefaults(userConfig);
 * ````
 * @internal
 */
export const withDefaults = (config) =>
	succeed({
		jsonAsConst: (() => {
			if (config.jsonAsConst === undefined) {
				return defaultConfig.jsonAsConst
			}
			if (Array.isArray(config.jsonAsConst)) {
				return config.jsonAsConst
			}
			if (typeof config.jsonAsConst === 'string') {
				return [config.jsonAsConst]
			}
			console.error('Invalid jsonAsConst value must be a string or array of strings')
			return defaultConfig.jsonAsConst
		})(),
		foundryProject: config.foundryProject ?? defaultConfig.foundryProject,
		remappings: {
			...defaultConfig.remappings,
			...config.remappings,
		},
		libs: [...defaultConfig.libs, ...(config.libs ?? [])],
		debug: config.debug ?? defaultConfig.debug,
		cacheDir: config.cacheDir ?? defaultConfig.cacheDir,
	}).pipe(
		tap((configWithDefaults) =>
			logDebug(
				`withDefaults: resolved config: ${JSON.stringify({
					originalConfig: config,
					configWithDefaults,
				})}`,
			),
		),
	)
