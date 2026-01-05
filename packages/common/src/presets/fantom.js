// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fantom chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 250
 * Chain Name: Fantom
 * Default Block Explorer: https://ftmscan.com
 * Default RPC URL: https://rpc.ankr.com/fantom
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fantom } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fantom,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fantom = createCommon({
	...nativeDefineChain({
		id: 250,
		name: 'Fantom',
		nativeCurrency: {
			name: 'Fantom',
			symbol: 'FTM',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ankr.com/fantom'],
			},
		},
		blockExplorers: {
			default: {
				name: 'FTMScan',
				url: 'https://ftmscan.com',
				apiUrl: 'https://api.ftmscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 33001987,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
