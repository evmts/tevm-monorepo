// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the aurora chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1313161554
 * Chain Name: Aurora
 * Default Block Explorer: https://aurorascan.dev
 * Default RPC URL: https://mainnet.aurora.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { aurora } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: aurora,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const aurora = createCommon({
	...nativeDefineChain({
		id: 1313161554,
		name: 'Aurora',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet.aurora.dev'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Aurorascan',
				url: 'https://aurorascan.dev',
				apiUrl: 'https://aurorascan.dev/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 62907816,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
