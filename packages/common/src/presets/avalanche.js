// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the avalanche chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 43114
 * Chain Name: Avalanche
 * Default Block Explorer: https://snowtrace.io
 * Default RPC URL: https://api.avax.network/ext/bc/C/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { avalanche } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: avalanche,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const avalanche = createCommon({
	...nativeDefineChain({
		id: 43114,
		name: 'Avalanche',
		nativeCurrency: {
			name: 'Avalanche',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://api.avax.network/ext/bc/C/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Snowtrace',
				url: 'https://snowtrace.io',
				apiUrl: 'https://api.snowtrace.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 11907934,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
