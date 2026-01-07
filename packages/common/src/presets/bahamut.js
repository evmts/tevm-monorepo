// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bahamut chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5165
 * Chain Name: Bahamut
 * Default Block Explorer: https://www.ftnscan.com
 * Default RPC URL: https://rpc1.bahamut.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bahamut } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bahamut,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bahamut = createCommon({
	...nativeDefineChain({
		id: 5165,
		name: 'Bahamut',
		nativeCurrency: {
			name: 'Fasttoken',
			symbol: 'FTN',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc1.bahamut.io', 'https://bahamut-rpc.publicnode.com', 'https://rpc2.bahamut.io'],
				webSocket: ['wss://ws1.sahara.bahamutchain.com', 'wss://bahamut-rpc.publicnode.com', 'wss://ws2.sahara.bahamutchain.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Ftnscan',
				url: 'https://www.ftnscan.com',
				apiUrl: 'https://www.ftnscan.com/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
