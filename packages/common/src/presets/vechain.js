// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the vechain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 100009
 * Chain Name: Vechain
 * Default Block Explorer: https://explore.vechain.org
 * Default RPC URL: https://mainnet.vechain.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { vechain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: vechain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const vechain = createCommon({
	...nativeDefineChain({
		id: 100009,
		name: 'Vechain',
		nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://mainnet.vechain.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Vechain Explorer',
				url: 'https://explore.vechain.org',
			},
			vechainStats: {
				name: 'Vechain Stats',
				url: 'https://vechainstats.com',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
