import { getDefaultSolcVersion } from './getDefaultSolcVersion'
import { expandedString } from './zodUtils'
import { isAddress } from 'viem'
import { z } from 'zod'

export const addressValidator = expandedString()
	.transform((a) => a as Address)
	.refine(isAddress, { message: 'Invalid ethereum address' })
	.describe('Valid ethereum address')
/**
 * Valid ethereum address
 */
export type Address = `0x${string}`

export const localContractsConfigValidator = z
	.strictObject({
		contracts: z.array(
			z.strictObject({
				name: expandedString().describe('Unique name of contract'),
				addresses: z.record(
					z.union([z.string(), z.number()]),
					addressValidator.describe('Address of contract'),
				),
			}),
		),
	})
	.describe(
		'Config of local Evmts imports of solidity contracts local to the project',
	)
/**
 * Configuration of local Evmts imports of solidity contracts local to the project
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
		z.literal('1'),
		z.literal('10'),
		z.literal('56'),
		z.literal('137'),
		z.literal('42161'),
	])
	.transform((a) => (Number.isInteger(a) ? a : Number.parseInt(a as string)))
	.describe('ChainIds of networks supported by etherscan')
/**
 * ChainIds of networks supported by etherscan
 */
export type SupportedEtherscanChainIds = z.infer<
	typeof supportedEtherscanChainIdsValidator
>

export const etherscanConfigValidator = z.strictObject({
	// optional for now only because its' the only option
	type: z.literal('etherscan').optional(),
	name: expandedString(),
	addresses: z.record(addressValidator),
})
/**
 * Configure external contracts to be imported through etherscan api
 */
export type EtherscanConfig = {
	/**
	 * Name of block explorer
	 */
	type?: 'etherscan' | undefined
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

export const etherscanApiKeyValidator = z
	.strictObject({
		'1': expandedString().optional().describe('Api key for mainnet'),
		'10': expandedString().optional().describe('Api key for Optimism'),
		'56': expandedString().optional().describe('Api key for BSC'),
		'137': expandedString().optional().describe('Api key for Polygon'),
		'42161': expandedString().optional().describe('Api key for Arbitrum'),
	})
	.partial()
	.describe('Api keys for etherscan by network')
/**
 * Api key for etherscan
 */
export type EtherscanApiKey = z.infer<typeof etherscanApiKeyValidator>
export const externalApiKeyValidator = z
	.strictObject({
		etherscan: etherscanApiKeyValidator.optional(),
	})
	.describe('Api keys for external services')
/**
 * Api keys for external services
 */
export type ExternalApiKey = z.infer<typeof externalApiKeyValidator>
export const externalConfigValidator = z
	.strictObject({
		apiKeys: externalApiKeyValidator.optional(),
		contracts: z.array(etherscanConfigValidator),
		out: expandedString(),
	})
	.describe('Configure external contracts to be imported into project')
/**
 * Configure external contracts to be imported into project
 */
type ExternalConfig = {
	/**
	 * Api keys for external services
	 */
	apiKeys?:
		| Partial<Record<'etherscan', EtherscanApiKey | undefined>>
		| undefined
	/**
	 * Array of external contracts to import
	 */
	contracts: EtherscanConfig[]
	/**
	 * Path to output directory
	 * @defaults "externalContracts"
	 */
	out?: string | undefined
}

export const compilerConfigValidator = z
	.strictObject({
		solcVersion: expandedString().optional(),
		foundryProject: z.union([z.boolean(), expandedString()]).optional(),
		libs: z.array(expandedString()).optional(),
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
	solcVersion?: string | undefined
	/**
	 * If set to true it will resolve forge remappings and libs
	 * Set to "path/to/forge/executable" to use a custom forge executable
	 */
	foundryProject?: boolean | string | undefined
	/**
	 * Sets directories to search for solidity imports in
	 * Read autoamtically for forge projects if forge: true
	 */
	libs?: string[] | undefined
}

export const evmtsConfigValidator = z.strictObject({
	name: z.literal('@evmts/ts-plugin').optional(),
	compiler: compilerConfigValidator.optional(),
	localContracts: localContractsConfigValidator.optional(),
	externalContracts: externalConfigValidator.optional(),
})

/**
 * Configuration for Evmts
 */
export type EvmtsConfig = {
	name?: '@evmts/ts-plugin' | undefined
	/**
	 * Configuration of the solidity compiler
	 */
	compiler?: CompilerConfig | undefined
	/**
	 * Globally configures addresses for contracts whose code is locally available
	 * in the project. If the contract is not being developed or deployed locally in the same
	 * repo it is recomended to use the external config rather than copy any solidity code in
	 * locally to the project
	 */
	localContracts?: LocalContractsConfig | undefined
	/**
	 * Globally configures addresses and abis for contracts pulled from external
	 * sources such as etherscan. If the contract is being developed locally it is
	 * recomended to use the local config instead
	 */
	externalContracts?: ExternalConfig | undefined
}

export type ResolvedConfig = {
	compiler: {
		remappings: Record<string, string>
		/**
		 * Solc version to use  (e.g. "0.8.13")
		 * @defaults "0.8.13"
		 * @see https://www.npmjs.com/package/solc
		 */
		solcVersion: string
		/**
		 * If set to true it will resolve forge remappings and libs
		 * Set to "path/to/forge/executable" to use a custom forge executable
		 */
		foundryProject: boolean | string
		/**
		 * Sets directories to search for solidity imports in
		 * Read autoamtically for forge projects if forge: true
		 */
		libs: string[]
	}
	localContracts: Required<LocalContractsConfig>
	externalContracts: {
		/**
		 * Api keys for external services
		 */
		apiKeys: Partial<Record<'etherscan', EtherscanApiKey | undefined>>
		/**
		 * Array of external contracts to import
		 */
		contracts: EtherscanConfig[]
		/**
		 * Path to output directory
		 * @defaults "externalContracts"
		 */
		out: string
	}
}

export const defaultConfig: ResolvedConfig = {
	compiler: {
		get solcVersion() {
			return getDefaultSolcVersion()
		},
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
