import { EvmtsConfig, ResolvedConfig, defaultConfig } from './Config'
import { handleDeprecations } from './handleDeprecations'
import { execSync } from 'child_process'
import * as path from 'path'

export type DefineConfig = (configFactory: () => EvmtsConfig) => {
	configFn: (configFilePath: string) => ResolvedConfig
}

export const defineConfig: DefineConfig = (configFactory) => ({
	configFn: (configFilePath: string) => {
		const { compiler, localContracts, externalContracts } =
			handleDeprecations(configFactory()) ?? {}
		const getFoundryDefaults = () => {
			if (!compiler?.foundryProject) {
				return {}
			}

			const forgeCommand =
				typeof compiler.foundryProject === 'string'
					? compiler.foundryProject
					: 'forge'
			let stdout
			try {
				stdout = execSync(`${forgeCommand} config --json`).toString()
			} catch (error) {
				throw new Error(
					`Failed to run forge using ${forgeCommand} command. Make sure forge is installed and accessible and forge config --json works`,
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

			// Process remappings
			const remappings: Record<string, string> = {}
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
			compiler: {
				solcVersion:
					compiler?.solcVersion ??
					foundryDefaults.solcVersion ??
					defaultConfig.compiler.solcVersion,
				remappings:
					foundryDefaults.remappings ?? defaultConfig.compiler.remappings,
				foundryProject:
					compiler?.foundryProject ?? defaultConfig.compiler.foundryProject,
				libs: [
					compiler?.libs,
					foundryDefaults.libs,
					defaultConfig.compiler.libs,
				]
					.filter(Boolean)
					.flat(),
			},
			localContracts: {
				contracts:
					localContracts?.contracts ?? defaultConfig.localContracts.contracts,
			},
			externalContracts: {
				out: externalContracts?.out ?? defaultConfig.externalContracts.out,
				apiKeys: externalContracts?.apiKeys
					? {
							...defaultConfig.externalContracts.apiKeys,
							...externalContracts.apiKeys,
					  }
					: defaultConfig.externalContracts.apiKeys,
				contracts:
					externalContracts?.contracts ??
					defaultConfig.externalContracts.contracts,
			},
		}
	},
})
