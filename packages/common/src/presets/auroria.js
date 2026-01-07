// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the auroria chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 205205
 * Chain Name: Auroria Testnet
 * Default Block Explorer: https://auroria.explorer.stratisevm.com
 * Default RPC URL: https://auroria.rpc.stratisevm.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { auroria } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: auroria,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const auroria = createCommon({
	...nativeDefineChain({
		id: 205205,
		name: 'Auroria Testnet',
		nativeCurrency: {
			name: 'Auroria Stratis',
			symbol: 'tSTRAX',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://auroria.rpc.stratisevm.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Auroria Testnet Explorer',
				url: 'https://auroria.explorer.stratisevm.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
