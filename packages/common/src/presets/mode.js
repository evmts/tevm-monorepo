// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mode chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 34443
 * Chain Name: Mode Mainnet
 * Default Block Explorer: https://modescan.io
 * Default RPC URL: https://mainnet.mode.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mode } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mode,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mode = createCommon({
	...nativeDefineChain({
		id: 34443,
		name: 'Mode Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet.mode.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Modescan',
				url: 'https://modescan.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 2465882,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
