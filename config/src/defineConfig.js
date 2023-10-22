import { loadFoundryConfig } from './utils/loadFoundryConfig.js'
import { mergeConfigs } from './utils/mergeConfigs.js'
import { tapLogAllErrors } from './utils/tapLogAllErrors.js'
import { validateUserConfig } from './utils/validateUserConfig.js'
import { withDefaults } from './utils/withDefaults.js'
import { all, catchAll, fail, flatMap, logDebug, tap } from 'effect/Effect'

/**
 * Error class for {@link defineConfig}
 */
export class DefineConfigError extends Error {
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
 */
export const defineConfig = (configFactory) => ({
	configFn: (configFilePath) => {
		const config = validateUserConfig(configFactory)
		const foundryConfig = flatMap(config, ({ foundryProject }) =>
			loadFoundryConfig(foundryProject, configFilePath),
		)
		return logDebug(`defineConfig: ${JSON.stringify({ configFilePath })}`).pipe(
			flatMap(() => all([config, foundryConfig])),
			flatMap(mergeConfigs),
			flatMap(withDefaults),
			tap((config) => logDebug(`defineConfig: ${JSON.stringify({ config })}`)),
			tapLogAllErrors(),
			catchAll((e) => fail(new DefineConfigError(configFilePath, e))),
		)
	},
})
