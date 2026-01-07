// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the arbitrum chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42161
 * Chain Name: Arbitrum One
 * Default Block Explorer: https://arbiscan.io
 * Default RPC URL: https://arb1.arbitrum.io/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { arbitrum } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: arbitrum,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const arbitrum = createCommon({
	...nativeDefineChain({
		id: 42161,
		name: 'Arbitrum One',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		blockTime: 250,
		rpcUrls: {
			default: {
				http: ['https://arb1.arbitrum.io/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Arbiscan',
				url: 'https://arbiscan.io',
				apiUrl: 'https://api.arbiscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 7654707,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
