import { succeed } from 'effect/Effect'

/**
 * Merges multiple configs into a single config
 * The last config in the list takes precedence on any given property
 * @param {Array<import("../types.js").CompilerConfig>} configs
 * @returns {import("effect/Effect").Effect<import("../types.js").CompilerConfig, never, never>}
 * @example
 * ```ts
 * import {runSync} from 'effect/Effect'
 * import {mergeConfigs} from '@tevm/config'
 * const userConfig = { remappings: { key1: 'value1' }, libs: ['lib1'] };
 * const foundryConfig = { remappings: { key2: 'value2' }, libs: ['lib2', 'lib1'], foundryProject: 'forge' };
 * const mergedConfig = runSync(mergeConfigs([userConfig, foundryConfig]));
 * ````
 * @internal
 */
export const mergeConfigs = (configs) =>
	succeed({
		remappings: Object.fromEntries(configs.flatMap((config) => Object.entries(config.remappings ?? {}))),
		foundryProject: configs.reverse().find((config) => config.foundryProject !== undefined)?.foundryProject,
		libs: [...new Set(configs.flatMap((config) => config.libs ?? []))],
		debug: configs.reverse().find((config) => config.debug !== undefined)?.debug,
		cacheDir: configs.reverse().find((config) => config.cacheDir !== undefined)?.cacheDir,
	})
