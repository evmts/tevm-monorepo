// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the haqqMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11235
 * Chain Name: HAQQ Mainnet
 * Default Block Explorer: https://explorer.haqq.network
 * Default RPC URL: https://rpc.eth.haqq.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { haqqMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: haqqMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const haqqMainnet = createCommon({
	...nativeDefineChain({
		id: 11235,
		name: 'HAQQ Mainnet',
		nativeCurrency: {
			name: 'Islamic Coin',
			symbol: 'ISLM',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.eth.haqq.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'HAQQ Explorer',
				url: 'https://explorer.haqq.network',
				apiUrl: 'https://explorer.haqq.network/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
