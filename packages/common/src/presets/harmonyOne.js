// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the harmonyOne chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1666600000
 * Chain Name: Harmony One
 * Default Block Explorer: https://explorer.harmony.one
 * Default RPC URL: https://rpc.ankr.com/harmony
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { harmonyOne } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: harmonyOne,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const harmonyOne = createCommon({
	...nativeDefineChain({
		id: 1666600000,
		name: 'Harmony One',
		nativeCurrency: {
			name: 'ONE',
			symbol: 'ONE',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ankr.com/harmony'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Harmony Explorer',
				url: 'https://explorer.harmony.one',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 24185753,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
