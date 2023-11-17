import { logDebug, succeed, tap } from 'effect/Effect'

/**
 * The default CompilerConfig
 */
export const defaultConfig = {
	foundryProject: false,
	remappings: {},
	libs: [],
	debug: false,
}

/**
 * Merges the given config with the default config into a {@link import("../types.js").ResolvedCompilerConfig}
 * @param {import("../types.js").CompilerConfig} config
 * @returns {import("effect/Effect").Effect<never, never, import("../types.js").ResolvedCompilerConfig>}
 * @example
 * ```ts
 * const userConfig = { remappings: { key1: 'value1' }, libs: ['lib1'] };
 * const resolvedConfig = withDefaults(userConfig);
 * ````
 * @internal
 */
export const withDefaults = (config) =>
	succeed({
		foundryProject: config.foundryProject ?? defaultConfig.foundryProject,
		remappings: {
			...defaultConfig.remappings,
			...config.remappings,
		},
		libs: [...defaultConfig.libs, ...(config.libs ?? [])],
		debug: config.debug ?? defaultConfig.debug,
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
