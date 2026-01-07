// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bobaSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 28882
 * Chain Name: Boba Sepolia
 * Default Block Explorer: https://testnet.bobascan.com
 * Default RPC URL: https://sepolia.boba.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bobaSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bobaSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bobaSepolia = createCommon({
	...nativeDefineChain({
		id: 28882,
		name: 'Boba Sepolia',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://sepolia.boba.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BOBAScan',
				url: 'https://testnet.bobascan.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
