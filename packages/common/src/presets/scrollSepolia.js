// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the scrollSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 534351
 * Chain Name: Scroll Sepolia
 * Default Block Explorer: https://sepolia-blockscout.scroll.io
 * Default RPC URL: https://sepolia-rpc.scroll.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { scrollSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: scrollSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const scrollSepolia = createCommon({
	...nativeDefineChain({
		id: 534351,
		name: 'Scroll Sepolia',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia-rpc.scroll.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://sepolia-blockscout.scroll.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 9473,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
