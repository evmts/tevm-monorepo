// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ham chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5112
 * Chain Name: Ham
 * Default Block Explorer: https://explorer.ham.fun
 * Default RPC URL: https://rpc.ham.fun
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ham } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ham,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ham = createCommon({
	...nativeDefineChain({
		id: 5112,
		name: 'Ham',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ham.fun'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Ham Explorer',
				url: 'https://explorer.ham.fun',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 54,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
