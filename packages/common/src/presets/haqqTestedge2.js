// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the haqqTestedge2 chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 54211
 * Chain Name: HAQQ Testedge 2
 * Default Block Explorer: https://explorer.testedge2.haqq.network
 * Default RPC URL: https://rpc.eth.testedge2.haqq.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { haqqTestedge2 } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: haqqTestedge2,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const haqqTestedge2 = createCommon({
	...nativeDefineChain({
		id: 54211,
		name: 'HAQQ Testedge 2',
		nativeCurrency: {
			name: 'Islamic Coin',
			symbol: 'ISLM',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.eth.testedge2.haqq.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'HAQQ Testedge Explorer',
				url: 'https://explorer.testedge2.haqq.network',
				apiUrl: 'https://explorer.testedge2.haqq.network/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
