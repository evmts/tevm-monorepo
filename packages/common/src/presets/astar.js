// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the astar chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 592
 * Chain Name: Astar
 * Default Block Explorer: https://astar.subscan.io
 * Default RPC URL: https://astar.api.onfinality.io/public
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { astar } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: astar,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const astar = createCommon({
	...nativeDefineChain({
		id: 592,
		name: 'Astar',
		nativeCurrency: {
			name: 'Astar',
			symbol: 'ASTR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://astar.api.onfinality.io/public'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Astar Subscan',
				url: 'https://astar.subscan.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 761794,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
