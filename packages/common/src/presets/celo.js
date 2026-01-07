// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the celo chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42220
 * Chain Name: Celo
 * Default Block Explorer: https://celoscan.io
 * Default RPC URL: https://forno.celo.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { celo } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: celo,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const celo = createCommon({
	...nativeDefineChain({
		id: 42220,
		name: 'Celo',
		nativeCurrency: {
			name: 'CELO',
			symbol: 'CELO',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://forno.celo.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Celo Explorer',
				url: 'https://celoscan.io',
				apiUrl: 'https://api.celoscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 13112599,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
