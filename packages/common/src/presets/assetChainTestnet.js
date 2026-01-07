// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the assetChainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42421
 * Chain Name: AssetChain Testnet
 * Default Block Explorer: https://scan-testnet.assetchain.org
 * Default RPC URL: https://enugu-rpc.assetchain.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { assetChainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: assetChainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const assetChainTestnet = createCommon({
	...nativeDefineChain({
		id: 42421,
		name: 'AssetChain Testnet',
		nativeCurrency: {
			name: 'Real World Asset',
			symbol: 'RWA',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://enugu-rpc.assetchain.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Asset Chain Testnet Explorer',
				url: 'https://scan-testnet.assetchain.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 0,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
