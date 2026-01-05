// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the optimismSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11155420
 * Chain Name: OP Sepolia
 * Default Block Explorer: https://optimism-sepolia.blockscout.com
 * Default RPC URL: https://sepolia.optimism.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { optimismSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: optimismSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const optimismSepolia = createCommon({
	...nativeDefineChain({
		id: 11155420,
		name: 'OP Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia.optimism.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://optimism-sepolia.blockscout.com',
				apiUrl: 'https://optimism-sepolia.blockscout.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1620204,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
