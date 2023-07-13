import { EVMtsConfig, ResolvedConfig, defaultConfig } from './EVMtsConfig'
import { handleDeprecations } from './handleDeprecations'
import { execSync } from 'child_process'
import * as path from 'path'

export type DefineConfig = (configFactory: () => EVMtsConfig) => {
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

		const etherscanKeysEntries = Object.entries(externalContracts?.apiKeys?.etherscan ?? [])
		const etherscanKeys = etherscanKeysEntries.length > 0 ? Object.fromEntries(etherscanKeysEntries.map(([network, apiKey]) => {
			console.log({ network, apiKey })
			if (!apiKey.startsWith('$')) {
				throw new Error(`Invalid etherscan api key for network ${network} in EVMts config in tsconfig.json. 
It should be an environment variable starting with $ e.g. $ETHERSCAN_API_KEY`)
			}
			console.log(process.env)
			const k = apiKey.replace(/^\$/, '')
			return [network, process.env[k]]
		})) : undefined
		const apiKeys = { etherscan: etherscanKeys }


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
				libs:
					compiler?.libs ?? foundryDefaults.libs ?? defaultConfig.compiler.libs,
			},
			localContracts: {
				contracts:
					localContracts?.contracts ?? defaultConfig.localContracts.contracts,
			},
			externalContracts: {
				out: externalContracts?.out ?? defaultConfig.externalContracts.out,
				apiKeys:
					externalContracts?.apiKeys ? { ...defaultConfig.externalContracts.apiKeys, ...apiKeys } : defaultConfig.externalContracts.apiKeys,
				contracts:
					externalContracts?.contracts ??
					defaultConfig.externalContracts.contracts,
			},
		}
	},
})
