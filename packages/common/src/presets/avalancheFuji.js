// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the avalancheFuji chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 43113
 * Chain Name: Avalanche Fuji
 * Default Block Explorer: https://testnet.snowtrace.io
 * Default RPC URL: https://api.avax-test.network/ext/bc/C/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { avalancheFuji } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: avalancheFuji,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const avalancheFuji = createCommon({
	...nativeDefineChain({
		id: 43113,
		name: 'Avalanche Fuji',
		nativeCurrency: {
			name: 'Avalanche Fuji',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://api.avax-test.network/ext/bc/C/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'SnowTrace',
				url: 'https://testnet.snowtrace.io',
				apiUrl: 'https://api-testnet.snowtrace.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 7096959,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
