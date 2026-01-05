// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the blast chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 81457
 * Chain Name: Blast
 * Default Block Explorer: https://blastscan.io
 * Default RPC URL: https://rpc.blast.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { blast } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: blast,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const blast = createCommon({
	...nativeDefineChain({
		id: 81457,
		name: 'Blast',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.blast.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blastscan',
				url: 'https://blastscan.io',
				apiUrl: 'https://api.blastscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 212929,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
