// #!/usr/bin/env node
import { type EtherscanConfig, externalConfigValidator } from '@evmts/config'
import { etherscan } from '@wagmi/cli/plugins'
import type { ContractConfig } from '@wagmi/cli'
import { z } from 'zod'

export const handleEtherscanOptionsValidator = z.object({
  // TODO call transform on this to transform the type such that it's required
  externalContracts: externalConfigValidator
    .refine(externalContracts => {
      const networksWithApiKey = new Set(Object.keys(externalContracts.apiKeys?.etherscan ?? {}).map(String))
      externalContracts.contracts.forEach(contract => {
        const networks = Object.keys(contract.addresses)
        return networks.every(network => {
          if (networksWithApiKey.has(String(network))) {
            return true
          }
          return false
        }, { message: 'No api keys found in externalContracts.apiKeys.etherscan. Please configure an apiKey' })
      })
    })
    .refine(externalContracts => {
      // check that at least 1 contract exists
      if (!externalContracts.contracts.length) {
        return false
      }
      return true
    })
}).refine(config => Boolean(config.externalContracts), {
  message: 'No external contracts config found in Evmts config. Cannot generate without a config with api keys and contracts',
})
export type HandleEtherscanOptions = z.infer<typeof handleEtherscanOptionsValidator>

export const handleEtherscan = async ({
  externalContracts,
}: HandleEtherscanOptions, logger: Pick<typeof console, 'log' | 'error' | 'warn'>) => {
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

  const result:
    Record<string, ContractConfig & EtherscanConfig> = {}

  for (const [chainId, contracts] of Object.entries(contractsGroupedByChain)) {
    // TODO make me typesafe getting these etherscan config types to work right has been painful
    const apiKey = externalContracts.apiKeys!.etherscan![chainId as '1']
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
    console.log({ apiKey })
    logger.log(`fetching contracts from etherscan on chain ${chainId}...`)
    const resolvedContracts = await etherscan({
      apiKey,
      contracts,
      chainId: Number.parseInt(chainId) as 1,
    }).contracts()

    logger.log('processing etherscan contracts...')
    resolvedContracts.forEach((resolvedContract, i) => {
      const contractConfig = contracts[i]
      if (!contractConfig) {
        throw new Error('Contract config not found')
      }
      // TODO handle corner case of the abis on different networks not matching
      result[contractConfig.name] = {
        ...contractConfig,
        ...result[contractConfig.name],
        abi: resolvedContract.abi,
        addresses: {
          ...result[contractConfig.name]?.addresses,
          [chainId]: contractConfig.addresses[chainId]
        }
      }
    })
  }

  if (Object.values(result).length === 0) {
    throw new Error('No result from etherscan plugin')
  }

  return result
}
