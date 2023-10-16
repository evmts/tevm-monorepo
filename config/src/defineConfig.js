import {
	CompilerConfigValidator,
	defaultConfig,
} from './Config.js'
import { execSync } from 'child_process'
import * as path from 'path'

/**
 * @type {import("./types.js").DefineConfig}
 */
export const defineConfig = (configFactory) => ({
	configFn: (configFilePath) => {
		const parsedConfig = CompilerConfigValidator.safeParse(
			configFactory() ?? {},
		)
		if (!parsedConfig.success) {
			throw new Error(
				`Invalid config file ${configFilePath}: ${JSON.stringify(
					parsedConfig.error.format(),
				)}`,
			)
		}
		const { libs, solcVersion, foundryProject } = parsedConfig.data
		const getFoundryDefaults = () => {
			if (!foundryProject) {
				return {}
			}

			const forgeCommand =
				typeof foundryProject === 'string' ? foundryProject : 'forge'
			let stdout
			try {
				stdout = execSync(`${forgeCommand} config --json`).toString()
			} catch (error) {
				throw new Error(
					`Failed to run forge using ${forgeCommand} command. Make sure forge is installed and accessible and forge config --json works.
note: forge is used to fetch remappings only if forgeConfig is set. If you would prefer to not use forge you can set remappings
or lib directly in your EVMts compiler config
					`,
				)
			}
			let forgeConfig
			try {
				forgeConfig = JSON.parse(stdout)
			} catch (error) {
				throw new Error(
					'Failed to parse the output of forge config command. The command output is not a valid JSON.',
				)
			}

			/**
			 * @type {Record<string, string>}
			 */
			const remappings = {}
			if (forgeConfig.remappings) {
				for (const remap of forgeConfig.remappings) {
					const parts = remap.split('=')
					if (parts.length !== 2) {
						throw new Error(
							`Invalid format for remapping: ${remap}. It should be in the format key=value.`,
						)
					}
					const [key, value] = parts
					remappings[key.trim()] = path.join(configFilePath, value.trim())
				}
			}

			return {
				solcVersion: forgeConfig?.solc_version,
				libs: forgeConfig?.libs,
				remappings: remappings,
			}
		}

		const foundryDefaults = getFoundryDefaults()

		return {
			solcVersion:
				solcVersion ?? foundryDefaults.solcVersion ?? defaultConfig.solcVersion,
			remappings: foundryDefaults.remappings ?? defaultConfig.remappings,
			foundryProject: foundryProject ?? defaultConfig.foundryProject,
			libs: [libs, foundryDefaults.libs, defaultConfig.libs]
				.filter(Boolean)
				.flat(),
		}
	},
})
