import { isAddress } from 'viem'
import { z } from 'zod'

export const addressValidator = z
	.string()
	.transform((a) => a as Address)
	.refine(isAddress)
	.describe('Valid ethereum address')
/**
 * Valid ethereum address
 */
export type Address = `0x${string}`

export const localContractsConfigValidator = z
	.strictObject({
		addresses: z.array(
			z.strictObject({
				name: z.string().describe('Unique name of contract'),
				address: addressValidator.describe('Address of contract'),
			}),
		),
	})
	.describe(
		'Config of local EVMts imports of solidity contracts local to the project',
	)
/**
 * Configuration of local EVMts imports of solidity contracts local to the project
 * This is in contrast to external contracts which are pulled in from external sources
 * like etherscan
 */
export type LocalContractsConfig<
	TAddresses extends Record<number, Address> = Record<number, Address>,
> = {
	/**
	 * @experimental
	 * Globally configure addresses for a contract by network
	 **/
	contracts: ReadonlyArray<{ addresses: TAddresses; name: string }>
}

export const supportedEtherscanChainIdsValidator = z
	.union([
		z.literal(1),
		z.literal(10),
		z.literal(56),
		z.literal(137),
		z.literal(42161),
	])
	.describe('ChainIds of networks supported by etherscan')
/**
 * ChainIds of networks supported by etherscan
 */
export type SupportedEtherscanChainIds = z.infer<
	typeof supportedEtherscanChainIdsValidator
>

export const etherscanConfigValidator = z.strictObject({
	type: z.literal('etherscan'),
	name: z.string(),
	addresses: z.record(addressValidator),
})
/**
 * Configure external contracts to be imported through etherscan api
 */
export type EtherscanConfig = {
	/**
	 * Name of block explorer
	 */
	type: 'etherscan'
	/**
	 * Unique name of contract
	 */
	name: string
	/**
	 * Mapping of network ids to deployed addresses.
	 * Networks must be supported by the plugin
	 */
	addresses: Partial<Record<SupportedEtherscanChainIds, Address>>
}

export const externalConfigValidator = z
	.strictObject({
		apiKeys: z
			.strictObject({
				etherscan: z.record(z.string().optional()),
			})
			.optional(),
		contracts: z.array(etherscanConfigValidator),
		out: z.string(),
	})
	.describe('Configure external contracts to be imported into project')
/**
 * Configure external contracts to be imported into project
 */
type ExternalConfig = {
	/**
	 * Api keys for external services
	 */
	apiKeys?: Record<'etherscan', Record<number, string>>
	/**
	 * Array of external contracts to import
	 */
	contracts: EtherscanConfig[]
	/**
	 * Path to output directory
	 * @defaults "externalContracts"
	 */
	out?: string
}

export const compilerConfigValidator = z
	.strictObject({
		solcVersion: z.string().optional(),
		foundryProject: z.union([z.boolean(), z.string()]).optional(),
		libs: z.array(z.string()).optional(),
	})
	.describe('Configuration of the solidity compiler')
/**
 * Configuration of the solidity compiler
 */
export type CompilerConfig = {
	/**
	 * Solc version to use  (e.g. "0.8.13")
	 * @defaults "0.8.13"
	 * @see https://www.npmjs.com/package/solc
	 */
	solcVersion?: string
	/**
	 * If set to true it will resolve forge remappings and libs
	 * Set to "path/to/forge/executable" to use a custom forge executable
	 */
	foundryProject?: boolean | string
	/**
	 * Sets directories to search for solidity imports in
	 * Read autoamtically for forge projects if forge: true
	 */
	libs?: string[]
}

/**
 * Configuration for EVMts
 */
export type EVMtsConfig = {
	/**
	 * Configuration of the solidity compiler
	 */
	compiler?: CompilerConfig
	/**
	 * Globally configures addresses for contracts whose code is locally available
	 * in the project. If the contract is not being developed or deployed locally in the same
	 * repo it is recomended to use the external config rather than copy any solidity code in
	 * locally to the project
	 */
	localContracts?: LocalContractsConfig
	/**
	 * Globally configures addresses and abis for contracts pulled from external
	 * sources such as etherscan. If the contract is being developed locally it is
	 * recomended to use the local config instead
	 */
	externalContracts?: ExternalConfig
}

export type ResolvedConfig = {
	compiler: Required<CompilerConfig> & {
		remappings: Record<string, string>
	}
	localContracts: Required<LocalContractsConfig>
	externalContracts: Required<ExternalConfig>
}
export const defaultConfig: ResolvedConfig = {
	compiler: {
		solcVersion: '0.8.20',
		foundryProject: false,
		remappings: {},
		libs: [],
	},
	localContracts: {
		contracts: [],
	},
	externalContracts: {
		out: 'externalContracts',
		apiKeys: {
			etherscan: {},
		},
		contracts: [],
	},
}
