// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the b3Sepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1993
 * Chain Name: B3 Sepolia
 * Default Block Explorer: https://sepolia.explorer.b3.fun
 * Default RPC URL: https://sepolia.b3.fun/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { b3Sepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: b3Sepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const b3Sepolia = createCommon({
	...nativeDefineChain({
		id: 1993,
		name: 'B3 Sepolia',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia.b3.fun/http'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://sepolia.explorer.b3.fun',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 0,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
