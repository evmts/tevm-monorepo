// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ancient8 chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 888888888
 * Chain Name: Ancient8
 * Default Block Explorer: https://scan.ancient8.gg
 * Default RPC URL: https://rpc.ancient8.gg
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ancient8 } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ancient8,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ancient8 = createCommon({
	...nativeDefineChain({
		id: 888888888,
		name: 'Ancient8',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ancient8.gg'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Ancient8 explorer',
				url: 'https://scan.ancient8.gg',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 0,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
