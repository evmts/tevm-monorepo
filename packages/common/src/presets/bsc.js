// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bsc chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 56
 * Chain Name: BNB Smart Chain
 * Default Block Explorer: https://bscscan.com
 * Default RPC URL: https://rpc.ankr.com/bsc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bsc } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bsc,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bsc = createCommon({
	...nativeDefineChain({
		id: 56,
		name: 'BNB Smart Chain',
		nativeCurrency: {
			name: 'BNB',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ankr.com/bsc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BscScan',
				url: 'https://bscscan.com',
				apiUrl: 'https://api.bscscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 15921452,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
