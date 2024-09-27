import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { catchTag, die, fail, flatMap, logDebug, succeed, tap, try as tryEffect } from 'effect/Effect'
import { validateUserConfig } from '../config/validateUserConfig.js'

/**
 * TypeError thrown when the user provided remappings is not properly formatted
 * @internal
 */
export class InvalidRemappingsError extends TypeError {
	/**
	 * @type {'InvalidRemappingsError'}
	 * @override
	 */
	name = 'InvalidRemappingsError'
	/**
	 * @type {'InvalidRemappingsError'}
	 */
	_tag = 'InvalidRemappingsError'
}

/**
 * @typedef {InvalidRemappingsError } LoadRemappingsError
 * @internal
 */

/**
 * Synchronously loads a Tevm config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<import('../types.js').CompilerConfig, LoadRemappingsError, never>} the contents of the tsconfig.json file
 * @internal
 */
export const loadRemappings = (configFilePath) => {
	const remappingsPath = path.join(configFilePath, 'remappings.txt')
	/**
	 * @param {string} configPath
	 */
	const readConfig = (configPath) =>
		tryEffect({
			try: () => readFileSync(configPath, 'utf8'),
			catch: () => new InvalidRemappingsError('No remapping file exists'),
		})
	return readConfig(remappingsPath).pipe(
		// if remappings doesn't exist that's fine just return nothing
		catchTag('InvalidRemappingsError', () => {
			return succeed('')
		}),
		flatMap((remappings) => {
			if (remappings.trim() === '') {
				return succeed({})
			}
			const remappingEntries = remappings.trim().split('\n')

			// validate remappings
			for (const remapping of remappingEntries) {
				if (remapping.trim() === '') {
					continue
				}
				const remappingArr = remapping.split('=')
				if (remappingArr.length !== 2) {
					return fail(
						new InvalidRemappingsError(
							`Invalid remapping ${remapping}. Remapping in remapping.txt should look like @solmate-utils/=lib/solmate/src/utils/`,
						),
					)
				}
			}

			// Turn remappings into a tevm config shape
			/**
			 * @type {import('../types.js').CompilerConfig}
			 */
			const config = {
				remappings: Object.fromEntries(
					remappingEntries.map((remapping) => {
						const [from, to] = remapping.trim().split('=')
						// TODO this line of code won't work on windows
						return /** @type {[string, string]}*/ ([
							from,
							`${configFilePath.endsWith('/') ? configFilePath : `${configFilePath}/`}${to?.startsWith('/') ? to.slice(1) : to}`,
						])
					}),
				),
			}
			return succeed(config)
		}),
		flatMap((cfg) => validateUserConfig(() => /** @type {import('../types.js').CompilerConfig}*/(cfg))),
		// it can't thrw. Could clean this up via making validateUserConfig take a config instead of a factory
		catchTag('ConfigFnThrowError', (e) => die(e)),
		// internal error if this happens
		catchTag('InvalidConfigError', (e) => die(e)),
		tap((normalizedConfig) =>
			logDebug(`loading remappings from ${configFilePath}: ${JSON.stringify(normalizedConfig)}`),
		),
	)
}
