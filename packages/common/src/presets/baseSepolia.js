// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the baseSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 84532
 * Chain Name: Base Sepolia
 * Default Block Explorer: https://sepolia.basescan.org
 * Default RPC URL: https://sepolia.base.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { baseSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: baseSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const baseSepolia = createCommon({
	...nativeDefineChain({
		id: 84532,
		name: 'Base Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia.base.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Basescan',
				url: 'https://sepolia.basescan.org',
				apiUrl: 'https://api-sepolia.basescan.org/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1059647,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
