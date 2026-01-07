// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the shapeSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11011
 * Chain Name: Shape Sepolia Testnet
 * Default Block Explorer: https://explorer-sepolia.shape.network/
 * Default RPC URL: https://sepolia.shape.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { shapeSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: shapeSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const shapeSepolia = createCommon({
	...nativeDefineChain({
		id: 11011,
		name: 'Shape Sepolia Testnet',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia.shape.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'blockscout',
				url: 'https://explorer-sepolia.shape.network/',
				apiUrl: 'https://explorer-sepolia.shape.network/api/v2',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1,
			},
		},
		testnet: true,
		sourceId: 11155111,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
