// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the scroll chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 534352
 * Chain Name: Scroll
 * Default Block Explorer: https://scrollscan.com
 * Default RPC URL: https://rpc.scroll.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { scroll } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: scroll,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const scroll = createCommon({
	...nativeDefineChain({
		id: 534352,
		name: 'Scroll',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.scroll.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Scrollscan',
				url: 'https://scrollscan.com',
				apiUrl: 'https://api.scrollscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 14,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
