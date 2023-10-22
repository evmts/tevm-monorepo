import { execSync } from 'child_process'
import { fail, succeed } from 'effect/Effect'
import * as path from 'path'

/**
 * Error thrown if foundry is not found in path while foundryProject is set in config
 */
export class FoundryNotFoundError extends Error {
	_tag = 'FoundryNotFoundError'
	/**
	 * @param {string} forgeCommand
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(forgeCommand, options) {
		super(
			`Failed to resolve forge config using "${forgeCommand} config --json" command. Make sure forge is installed and accessible and forge config --json works.
note: forge is used to fetch remappings only if forgeConfig is set. If you would prefer to not use forge you can set remappings
or lib directly in your EVMts compiler config and then EVMts will run without forge`,
			options,
		)
	}
}

/**
 * Error thrown if parsing the foundry config with `forge config` fails
 */
export class FoundryConfigError extends Error {
	_tag = 'FoundryConfigError'
	/**
	 * @param {string} forgeCommand
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(forgeCommand, options) {
		super(
			`Unable to resolve foundry config using ${forgeCommand} config --json`,
			options,
		)
	}
}

/**
 * Error thrown if foundry remappings cannot be parsed while foundryProject is set
 */
export class InvalidRemappingsError extends Error {
	_tag = 'InvalidRemappingsError'
	/**
	 * @param {string} remappings
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(remappings, options) {
		super(`Invalid remappings: ${remappings}`, options)
	}
}

/**
 * @typedef {FoundryNotFoundError | FoundryConfigError | InvalidRemappingsError} LoadFoundryConfigError
 */

/**
 * Loads the foundry config options if foundryProject is set so it can later be merged into the resolved config
 * Parses default options derived from foundry config if foundryProject is set
 * @param {string|boolean|undefined} foundryProject
 * @param {string} configFilePath
 * @returns {import('effect/Effect').Effect<never, LoadFoundryConfigError, import('../types.js').CompilerConfig>}
 */
export const loadFoundryConfig = (foundryProject, configFilePath) => {
	if (!foundryProject) {
		return succeed({})
	}

	const forgeCommand =
		typeof foundryProject === 'string' ? foundryProject : 'forge'
	let stdout
	try {
		stdout = execSync(`${forgeCommand} config --json`, {
			cwd: configFilePath,
		}).toString()
	} catch (cause) {
		console.error(cause)
		return fail(new FoundryNotFoundError(forgeCommand, { cause }))
	}
	let forgeConfig
	try {
		forgeConfig = JSON.parse(stdout)
	} catch (cause) {
		console.error(cause)
		return fail(new FoundryConfigError(forgeCommand, { cause }))
	}

	/**
	 * @type {Record<string, string>}
	 */
	const remappings = {}
	if (forgeConfig.remappings) {
		for (const remap of forgeConfig.remappings) {
			const parts = remap.split('=')
			if (parts.length !== 2) {
				return fail(new InvalidRemappingsError(remap))
			}
			const [key, value] = parts
			remappings[key.trim()] = path.join(configFilePath, value.trim())
		}
	}

	return succeed({
		libs: forgeConfig?.libs,
		remappings: remappings,
	})
}
