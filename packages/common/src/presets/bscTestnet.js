// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bscTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 97
 * Chain Name: BNB Smart Chain Testnet
 * Default Block Explorer: https://testnet.bscscan.com
 * Default RPC URL: https://data-seed-prebsc-1-s1.bnbchain.org:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bscTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bscTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bscTestnet = createCommon({
	...nativeDefineChain({
		id: 97,
		name: 'BNB Smart Chain Testnet',
		nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BscScan',
				url: 'https://testnet.bscscan.com',
				apiUrl: 'https://api-testnet.bscscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 17422483,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
