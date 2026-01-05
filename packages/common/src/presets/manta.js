// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the manta chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 169
 * Chain Name: Manta Pacific Mainnet
 * Default Block Explorer: https://pacific-explorer.manta.network
 * Default RPC URL: https://pacific-rpc.manta.network/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { manta } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: manta,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const manta = createCommon({
	...nativeDefineChain({
		id: 169,
		name: 'Manta Pacific Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://pacific-rpc.manta.network/http'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Manta Explorer',
				url: 'https://pacific-explorer.manta.network',
				apiUrl: 'https://pacific-explorer.manta.network/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 332890,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
