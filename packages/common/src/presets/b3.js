// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the b3 chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 8333
 * Chain Name: B3
 * Default Block Explorer: https://explorer.b3.fun
 * Default RPC URL: https://mainnet-rpc.b3.fun/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { b3 } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: b3,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const b3 = createCommon({
	...nativeDefineChain({
		id: 8333,
		name: 'B3',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet-rpc.b3.fun/http'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://explorer.b3.fun',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 0,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
