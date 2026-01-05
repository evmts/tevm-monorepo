// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mantle chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5000
 * Chain Name: Mantle
 * Default Block Explorer: https://mantlescan.xyz/
 * Default RPC URL: https://rpc.mantle.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mantle } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mantle,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mantle = createCommon({
	...nativeDefineChain({
		id: 5000,
		name: 'Mantle',
		nativeCurrency: {
			name: 'MNT',
			symbol: 'MNT',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.mantle.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Mantle Explorer',
				url: 'https://mantlescan.xyz/',
				apiUrl: 'https://api.mantlescan.xyz/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 304717,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
