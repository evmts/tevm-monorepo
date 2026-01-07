// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hederaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 296
 * Chain Name: Hedera Testnet
 * Default Block Explorer: https://hashscan.io/testnet
 * Default RPC URL: https://testnet.hashio.io/api
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hederaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hederaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hederaTestnet = createCommon({
	...nativeDefineChain({
		id: 296,
		name: 'Hedera Testnet',
		nativeCurrency: {
			name: 'HBAR',
			symbol: 'HBAR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://testnet.hashio.io/api'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Hashscan',
				url: 'https://hashscan.io/testnet',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
