import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import * as path from 'path'

// TODO import this from evmts core
type Address = `0x${string}`

type DeploymentConfig = {
	name: string
	// TODO address is experimental because current api has no way of knowing the network id
	// networkId: number
	/**
	 * @experimental
	 * Globally configure addresses for a contract by network
	 **/
	addresses: Record<number, Address>
}

export type Config = {
	/**
	 * Solc version to use  (e.g. "0.8.13")
	 * @defaults "0.8.13"
	 * @see https://www.npmjs.com/package/solc
	 */
	solcVersion?: string
	/**
	 * Globally configures addresses for specific contracts
	 */
	deployments?: DeploymentConfig[]
	/**
	 * If set to true it will resolve forge remappings and libs
	 * Set to "path/to/forge/executable" to use a custom forge executable
	 */
	forge?: boolean | string
	/**
	 * Sets directories to search for solidity imports in
	 * Read autoamtically for forge projects if forge: true
	 */
	libs?: string[]
}

export type ResolvedConfig = Required<Config> & {
	remappings: Record<string, string>
}

export const defaultConfig: ResolvedConfig = {
	solcVersion: '0.8.20',
	deployments: [],
	forge: false,
	remappings: {},
	libs: [],
}

/**
 * Reads the deployment folder of foundry-deploy or hardhat-deploy
 */
export const readDeployments = (
	pathToDeploymentFolder: string,
): DeploymentConfig[] => {
	console.log(pathToDeploymentFolder)
	console.error('readDeployments not implemented')
	return []
}

export type DefineConfig = (configFactory: () => Config) => {
	configFn: (configFilePath: string) => ResolvedConfig
}

export const defineConfig: DefineConfig = (configFactory) => ({
	configFn: (configFilePath: string) => {
		const userConfig = configFactory()
		const getFoundryDefaults = (): Partial<ResolvedConfig> => {
			if (!userConfig.forge) {
				return {}
			}

			const forgeCommand =
				typeof userConfig.forge === 'string' ? userConfig.forge : 'forge'
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
			solcVersion:
				userConfig.solcVersion ??
				foundryDefaults.solcVersion ??
				defaultConfig.solcVersion,
			deployments:
				userConfig.deployments ??
				foundryDefaults.deployments ??
				defaultConfig.deployments,
			forge: userConfig.forge ?? defaultConfig.forge,
			remappings: foundryDefaults.remappings ?? defaultConfig.remappings,
			libs: userConfig.libs ?? foundryDefaults.libs ?? defaultConfig.libs,
		}
	},
})

type LoadConfig = (configFilePath: string) => ResolvedConfig

export const loadConfigTs = async (configFilePath: string) => {
	const { bundleRequire } = await import('bundle-require')
	const configModule = await bundleRequire({
		filepath: path.join(configFilePath, 'evmts.config.ts'),
	})
	const config = configModule.mod.default?.default ?? configModule.mod.default
	if (!config) {
		return defaultConfig
	}
	if (config.configFn) {
		return config.configFn(configFilePath)
	}
	if (typeof config !== 'function') {
		return config
	}
	return config()
}

export const loadConfig: LoadConfig = (configFilePath) => {
	/**
	 * evmts.config.ts currently doesn't work for ts-plugin because it is not syncronous
	 * for now load config will load from tsconfig instead until fixed
	 */
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	let configStr
	try {
		configStr = readFileSync(tsConfigPath, 'utf8')
	} catch (error) {
		throw new Error(
			`Failed to read the file at ${tsConfigPath}. Make sure the file exists and is accessible.`,
		)
	}
	let configJson: {
		compilerOptions: {
			plugins?: Array<{ name: '@evmts/ts-plugin' } & Config>
		}
	}
	try {
		configJson = JSON.parse(configStr)
	} catch (e) {
		console.error(e)
		throw new Error(`tsconfig.json at ${tsConfigPath} is not valid json`)
	}

	const config = configJson.compilerOptions.plugins?.find(
		(plugin) => plugin.name === '@evmts/ts-plugin',
	)
	if (!config) {
		console.warn(
			'No EVMts plugin found in tsconfig.json. Using the default config',
		)
		return defaultConfig
	}
	return defineConfig(() => config).configFn(configFilePath)
}
