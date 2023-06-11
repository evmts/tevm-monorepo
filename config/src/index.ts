// TODO import this from evmts core
type Address = '0x${string}'

type DeploymentConfig = {
	contractName: string
	networkId: number
	address: Address
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
	out?: 'artifacts'
	/**
	 * Globally configures addresses for specific contracts
	 */
	deployments?: DeploymentConfig[]
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
			src: userConfig.src ?? 'src',
			out: userConfig.out ?? 'artifacts',
			solcVersion: userConfig.solcVersion ?? '0.8.13',
			libs: userConfig.libs ?? [],
			deployments: userConfig.deployments ?? [],
		}
	},
})
