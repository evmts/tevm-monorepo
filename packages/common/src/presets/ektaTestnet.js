// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ektaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1004
 * Chain Name: Ekta Testnet
 * Default Block Explorer: https://test.ektascan.io
 * Default RPC URL: https://test.ekta.io:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ektaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ektaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ektaTestnet = createCommon({
	...nativeDefineChain({
		id: 1004,
		name: 'Ekta Testnet',
		nativeCurrency: { name: 'EKTA', symbol: 'EKTA', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://test.ekta.io:8545'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Test Ektascan',
				url: 'https://test.ektascan.io',
				apiUrl: 'https://test.ektascan.io/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
