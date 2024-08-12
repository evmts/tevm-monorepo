import type { Address } from '@tevm/utils'
import type { KnownChainIds } from './KnownChainIds.js'

export type ParsedUri = {
	chainId: KnownChainIds
	address: Address
	rpcUrl?: string | undefined
	etherscanApiKey?: string | undefined
	etherscanBaseUrl?: string | undefined
	followProxies?: boolean | undefined
}
