// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the areonNetwork chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 463
 * Chain Name: Areon Network
 * Default Block Explorer: https://areonscan.com
 * Default RPC URL: https://mainnet-rpc.areon.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { areonNetwork } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: areonNetwork,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const areonNetwork = createCommon({
	...nativeDefineChain({
		id: 463,
		name: 'Areon Network',
		nativeCurrency: {
			name: 'Areon',
			symbol: 'AREA',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet-rpc.areon.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'AreonScan',
				url: 'https://areonscan.com',
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
