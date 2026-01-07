// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the boba chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 288
 * Chain Name: Boba Network
 * Default Block Explorer: https://bobascan.com
 * Default RPC URL: https://mainnet.boba.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { boba } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: boba,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const boba = createCommon({
	...nativeDefineChain({
		id: 288,
		name: 'Boba Network',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://mainnet.boba.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BOBAScan',
				url: 'https://bobascan.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 446859,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
