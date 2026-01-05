// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the arbitrumNova chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42170
 * Chain Name: Arbitrum Nova
 * Default Block Explorer: https://nova.arbiscan.io
 * Default RPC URL: https://nova.arbitrum.io/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { arbitrumNova } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: arbitrumNova,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const arbitrumNova = createCommon({
	...nativeDefineChain({
		id: 42170,
		name: 'Arbitrum Nova',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://nova.arbitrum.io/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Arbiscan',
				url: 'https://nova.arbiscan.io',
				apiUrl: 'https://api-nova.arbiscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1746963,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
