// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zora chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7777777
 * Chain Name: Zora
 * Default Block Explorer: https://explorer.zora.energy
 * Default RPC URL: https://rpc.zora.energy
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zora } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zora,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zora = createCommon({
	...nativeDefineChain({
		id: 7777777,
		name: 'Zora',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.zora.energy'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Explorer',
				url: 'https://explorer.zora.energy',
				apiUrl: 'https://explorer.zora.energy/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 5882,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
