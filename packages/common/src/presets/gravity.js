// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the gravity chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1625
 * Chain Name: Gravity Alpha Mainnet
 * Default Block Explorer: https://explorer.gravity.xyz
 * Default RPC URL: https://rpc.gravity.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { gravity } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: gravity,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const gravity = createCommon({
	...nativeDefineChain({
		id: 1625,
		name: 'Gravity Alpha Mainnet',
		nativeCurrency: {
			name: 'G.',
			symbol: 'G.',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.gravity.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Gravity Explorer',
				url: 'https://explorer.gravity.xyz',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 74,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
