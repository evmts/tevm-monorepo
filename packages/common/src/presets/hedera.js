// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hedera chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 295
 * Chain Name: Hedera Mainnet
 * Default Block Explorer: https://hashscan.io/mainnet
 * Default RPC URL: https://mainnet.hashio.io/api
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hedera } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hedera,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hedera = createCommon({
	...nativeDefineChain({
		id: 295,
		name: 'Hedera Mainnet',
		nativeCurrency: {
			name: 'HBAR',
			symbol: 'HBAR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet.hashio.io/api'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Hashscan',
				url: 'https://hashscan.io/mainnet',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
