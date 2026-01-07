// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the arbitrumSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 421614
 * Chain Name: Arbitrum Sepolia
 * Default Block Explorer: https://sepolia.arbiscan.io
 * Default RPC URL: https://sepolia-rollup.arbitrum.io/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { arbitrumSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: arbitrumSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const arbitrumSepolia = createCommon({
	...nativeDefineChain({
		id: 421614,
		name: 'Arbitrum Sepolia',
		nativeCurrency: {
			name: 'Arbitrum Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia-rollup.arbitrum.io/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Arbiscan',
				url: 'https://sepolia.arbiscan.io',
				apiUrl: 'https://api-sepolia.arbiscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 81930,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
