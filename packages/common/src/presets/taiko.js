// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the taiko chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 167000
 * Chain Name: Taiko Mainnet
 * Default Block Explorer: https://taikoscan.io
 * Default RPC URL: https://rpc.mainnet.taiko.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { taiko } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: taiko,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const taiko = createCommon({
	...nativeDefineChain({
		id: 167000,
		name: 'Taiko Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.mainnet.taiko.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Taikoscan',
				url: 'https://taikoscan.io',
				apiUrl: 'https://api.taikoscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcb2436774C3e191c85056d248EF4260ce5f27A9D',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
