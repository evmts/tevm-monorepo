// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the satoshiVMTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3110
 * Chain Name: SatoshiVM Testnet
 * Default Block Explorer: https://testnet.svmscan.io
 * Default RPC URL: https://test-rpc-node-http.svmscan.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { satoshiVMTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: satoshiVMTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const satoshiVMTestnet = createCommon({
	...nativeDefineChain({
		id: 3110,
		name: 'SatoshiVM Testnet',
		nativeCurrency: {
			name: 'BTC',
			symbol: 'BTC',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://test-rpc-node-http.svmscan.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'blockscout',
				url: 'https://testnet.svmscan.io',
				apiUrl: 'https://testnet.svmscan.io/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
