// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgeware chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2021
 * Chain Name: Edgeware EdgeEVM Mainnet
 * Default Block Explorer: https://edgscan.live
 * Default RPC URL: https://edgeware-evm.jelliedowl.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgeware } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgeware,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgeware = createCommon({
	...nativeDefineChain({
		id: 2021,
		name: 'Edgeware EdgeEVM Mainnet',
		nativeCurrency: { name: 'Edgeware', symbol: 'EDG', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://edgeware-evm.jelliedowl.net'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Edgscan by Bharathcoorg',
				url: 'https://edgscan.live',
				apiUrl: 'https://edgscan.live/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 18117872,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
