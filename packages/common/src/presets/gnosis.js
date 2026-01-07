// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the gnosis chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 100
 * Chain Name: Gnosis
 * Default Block Explorer: https://gnosisscan.io
 * Default RPC URL: https://rpc.gnosischain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { gnosis } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: gnosis,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const gnosis = createCommon({
	...nativeDefineChain({
		id: 100,
		name: 'Gnosis',
		nativeCurrency: {
			name: 'xDAI',
			symbol: 'XDAI',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.gnosischain.com'],
				webSocket: ['wss://rpc.gnosischain.com/wss'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Gnosisscan',
				url: 'https://gnosisscan.io',
				apiUrl: 'https://api.gnosisscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 21022491,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
