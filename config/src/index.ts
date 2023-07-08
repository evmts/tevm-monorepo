import { bundleRequire } from 'bundle-require'
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
	 * The source directory of the project containing `.sol` files
	 * @defaults "src" or configured src directory of foundry.toml
	 */
	src?: string
	/**
	 * Configure locations to resolve libraries in `.sol` files
	 * in addition to node_modules.  Currently does not read foundry.toml
	 * @defaults []
	 */
	libs?: string[]
	/**
	 * Solc version to use  (e.g. "0.8.13")
	 * @defaults "0.8.13"
	 * @see https://www.npmjs.com/package/solc
	 */
	solcVersion?: string
	/**
	 * The output directory for the compiled contracts
	 * @defaults "artifacts" or configured out directory of foundry.toml
	 */
	out?: string
	/**
	 * Globally configures addresses for specific contracts
	 */
	deployments?: DeploymentConfig[]
}

export const defaultConfig: Required<Config> = {
	src: 'src',
	out: 'artifacts',
	solcVersion: '0.8.13',
	libs: [],
	deployments: [],
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

export type ResolvedConfig = Required<Config>

export type DefineConfig = (configFactory: () => Config) => {
	configFn: () => ResolvedConfig
}

export const defineConfig: DefineConfig = (configFactory) => ({
	configFn: () => {
		const userConfig = configFactory()
		return {
			src: userConfig.src ?? defaultConfig.src,
			out: userConfig.out ?? defaultConfig.out,
			solcVersion: userConfig.solcVersion ?? defaultConfig.solcVersion,
			libs: userConfig.libs ?? [],
			deployments: userConfig.deployments ?? defaultConfig.deployments,
		}
	},
})

type LoadConfig = (configFilePath: string) => Promise<ResolvedConfig>

export const loadConfigTs: LoadConfig = async (configFilePath) => {
	const configModule = await bundleRequire({
		filepath: path.join(configFilePath, 'evmts.config.ts'),
	})
	const config = configModule.mod.default?.default ?? configModule.mod.default
	if (!config) {
		return defaultConfig
	}
	if (config.configFn) {
		return config.configFn()
	}
	if (typeof config !== 'function') {
		return config
	}
	return config()
}

export const loadConfig: LoadConfig = async (configFilePath) => {
	/**
	 * evmts.config.ts currently doesn't work for ts-plugin because it is not syncronous
	 * for now load config will load from tsconfig instead until fixed
	 */
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const configStr = readFileSync(tsConfigPath, 'utf8')
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
		return defaultConfig
	}
	return defineConfig(() => config).configFn()
}
