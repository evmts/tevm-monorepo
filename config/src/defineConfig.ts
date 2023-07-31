import {
	type EvmtsConfig,
	type ResolvedConfig,
	defaultConfig,
	evmtsConfigValidator,
} from './Config'
import { handleDeprecations } from './handleDeprecations'
import { expandedString } from './zodUtils'
import { execSync } from 'child_process'
import * as path from 'path'

export type DefineConfig = (configFactory: () => EvmtsConfig) => {
	configFn: (configFilePath: string) => ResolvedConfig
}

export const defineConfig: DefineConfig = (configFactory) => ({
	configFn: (configFilePath: string) => {
		const parsedConfig = evmtsConfigValidator.safeParse(
			handleDeprecations(configFactory()) ?? {},
		)
		if (!parsedConfig.success) {
			throw new Error(
				`Invalid config file ${configFilePath}: ${JSON.stringify(
					parsedConfig.error.format(),
				)}`,
			)
		}
		const { compiler, localContracts, externalContracts } = parsedConfig.data
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

		const apiKeys = externalContracts?.apiKeys
			? {
					...defaultConfig.externalContracts.apiKeys,
					...externalContracts.apiKeys,
					etherscan: {
						...defaultConfig.externalContracts.apiKeys?.etherscan,
						...externalContracts.apiKeys.etherscan,
						'1': expandedString()
							.optional()
							.parse(externalContracts.apiKeys.etherscan?.['1']),
						'10': expandedString()
							.optional()
							.parse(externalContracts.apiKeys.etherscan?.['10']),
						'56': expandedString()
							.optional()
							.parse(externalContracts.apiKeys.etherscan?.['10']),
						'137': expandedString()
							.optional()
							.parse(externalContracts.apiKeys.etherscan?.['10']),
						'42161': expandedString()
							.optional()
							.parse(externalContracts.apiKeys.etherscan?.['10']),
					},
			  }
			: defaultConfig.externalContracts.apiKeys

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
				apiKeys,
				contracts:
					externalContracts?.contracts ??
					defaultConfig.externalContracts.contracts,
			},
		}
	},
})
