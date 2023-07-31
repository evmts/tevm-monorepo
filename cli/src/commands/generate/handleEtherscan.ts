// #!/usr/bin/env node
import { type EtherscanConfig, externalConfigValidator } from '@evmts/config'
import type { ContractConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import fetch from 'isomorphic-fetch'
import { z } from 'zod'

const apiUrls = {
	// Ethereum
	[1]: 'https://api.etherscan.io/api',
	[5]: 'https://api-goerli.etherscan.io/api',
	[11155111]: 'https://api-sepolia.etherscan.io/api',
	// Optimism
	[10]: 'https://api-optimistic.etherscan.io/api',
	[420]: 'https://api-goerli-optimistic.etherscan.io/api',
	// Polygon
	[137]: 'https://api.polygonscan.com/api',
	[80_001]: 'https://api-testnet.polygonscan.com/api',
	// Arbitrum
	[42_161]: 'https://api.arbiscan.io/api',
	[421_613]: 'https://api-goerli.arbiscan.io/api',
	// BNB Smart Chain
	[56]: 'https://api.bscscan.com/api',
	[97]: 'https://api-testnet.bscscan.com/api',
	// Heco Chain
	[128]: 'https://api.hecoinfo.com/api',
	[256]: 'https://api-testnet.hecoinfo.com/api',
	// Fantom
	[250]: 'https://api.ftmscan.com/api',
	[4002]: 'https://api-testnet.ftmscan.com/api',
	// Avalanche
	[43114]: 'https://api.snowtrace.io/api',
	[43113]: 'https://api-testnet.snowtrace.io/api',
	// Celo
	[42220]: 'https://api.celoscan.io/api',
	[44787]: 'https://api-alfajores.celoscan.io/api',
} as const

/**
 * TODO this code is awful and untested fix that
 */
export const handleEtherscanOptionsValidator = z
	.object({
		// TODO call transform on this to transform the type such that it's required
		externalContracts: externalConfigValidator
			.refine((externalContracts) => {
				const networksWithApiKey = new Set(
					Object.keys(externalContracts.apiKeys?.etherscan ?? {}).map(String),
				)
				externalContracts.contracts.forEach((contract) => {
					const networks = Object.keys(contract.addresses)
					return networks.every(
						(network) => {
							if (networksWithApiKey.has(String(network))) {
								return true
							}
							return false
						},
						{
							message:
								'No api keys found in externalContracts.apiKeys.etherscan. Please configure an apiKey',
						},
					)
				})
			})
			.refine((externalContracts) => {
				// check that at least 1 contract exists
				if (!externalContracts.contracts.length) {
					return false
				}
				return true
			}),
	})
	.refine((config) => Boolean(config.externalContracts), {
		message:
			'No external contracts config found in Evmts config. Cannot generate without a config with api keys and contracts',
	})
export type HandleEtherscanOptions = z.infer<
	typeof handleEtherscanOptionsValidator
>

export const handleEtherscan = async (
	{ externalContracts }: HandleEtherscanOptions,
	logger: Pick<typeof console, 'log' | 'error' | 'warn'>,
) => {
	const contractsGroupedByChain: Record<
		number,
		typeof externalContracts.contracts
	> = {}

	for (const contract of externalContracts.contracts) {
		for (const [chainId, address] of Object.entries(contract.addresses)) {
			const id = Number.parseInt(chainId)
			contractsGroupedByChain[id] = contractsGroupedByChain[id] ?? []
			contractsGroupedByChain[id]?.push({
				...contract,
				address,
				// addresses: { [id as 1]: address },
			} as any)
		}
	}

	const sources: Record<string, string> = {}
	const result: Record<
		string,
		ContractConfig & EtherscanConfig & { source: string | undefined }
	> = {}

	for (const [chainId, contracts] of Object.entries(contractsGroupedByChain)) {
		// TODO make me typesafe getting these etherscan config types to work right has been painful
		const apiKey = externalContracts.apiKeys?.etherscan?.[chainId as '1']
		if (!apiKey) {
			throw new Error(
				`No etherscan api key for chainId ${chainId} in etherscan plugin at externalContracts.apiKeys.etherscan.${chainId}. Please configure an apiKey`,
			)
		}
		if (apiKey.startsWith('$')) {
			throw new Error(
				`Etherscan api key for chainId ${chainId} in etherscan plugin at externalContracts.apiKeys.etherscan.${chainId} is not configured. Please configure an apiKey
Detected that it starts with $. Did you forget to include this env variable in your path?`,
			)
		}
		logger.log(`fetching abis from etherscan on chain ${chainId}...`)
		const resolvedContracts = await etherscan({
			apiKey,
			// TODO better types
			contracts: contracts as any,
			chainId: Number.parseInt(chainId) as 1,
		}).contracts()
		for (const resolvedContract of resolvedContracts) {
			if (sources[resolvedContract.name]) {
				continue
			}
			logger.log(`fetching source code for ${resolvedContract.name}...}`)
			const resolvedAddress =
				typeof resolvedContract.address === 'string'
					? resolvedContract.address
					: resolvedContract.address?.[chainId as any]
			if (!resolvedAddress) {
				logger.error(
					`No address found for ${resolvedContract.name} on chain ${chainId}`,
				)
				continue
			}
			const url = `${
				apiUrls[chainId as '1']
			}?module=contract&action=getsourcecode&address=${resolvedAddress}${
				apiKey ? `&apikey=${apiKey}` : ''
			}`
			type Source = {
				result: {
					SourceCode: string
				}[]
			}
			try {
				await fetch(url)
					.then((res: any) => res.json())
					.then((apiResponse: Source) => {
						const source = apiResponse?.result?.[0]?.SourceCode
						if (!source) {
							logger.error('Unable to parse contract source. Continuing...')
							return
						}
						sources[resolvedContract.name] = source
					})
			} catch (e) {
				logger.error(
					`Error fetching source code for ${resolvedContract.name}...}`,
				)
				logger.error(e)
			}
		}

		logger.log('processing etherscan contracts...')
		resolvedContracts.forEach((resolvedContract, i) => {
			logger.log(`processing ${resolvedContract.name}...`)
			const contractConfig = contracts[i]
			if (!contractConfig) {
				throw new Error('Contract config not found')
			}
			if (!contractConfig.name) {
				throw new Error('Contract config name not found')
			}
			// TODO handle corner case of the abis on different networks not matching
			result[contractConfig.name] = {
				...contractConfig,
				...result[contractConfig.name],
				name: contractConfig.name,
				source: sources[contractConfig.name],
				abi: resolvedContract.abi,
				addresses: {
					...result[contractConfig.name]?.addresses,
					[chainId]: contractConfig.addresses[chainId],
				},
			}
		})
	}

	if (Object.values(result).length === 0) {
		throw new Error('No result from etherscan plugin')
	}

	return result
}
