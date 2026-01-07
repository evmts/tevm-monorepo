// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the satoshiVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3109
 * Chain Name: SatoshiVM Alpha Mainnet
 * Default Block Explorer: https://svmscan.io
 * Default RPC URL: https://alpha-rpc-node-http.svmscan.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { satoshiVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: satoshiVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const satoshiVM = createCommon({
	...nativeDefineChain({
		id: 3109,
		name: 'SatoshiVM Alpha Mainnet',
		nativeCurrency: {
			name: 'BTC',
			symbol: 'BTC',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://alpha-rpc-node-http.svmscan.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'blockscout',
				url: 'https://svmscan.io',
				apiUrl: 'https://svmscan.io/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
