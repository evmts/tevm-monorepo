// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the sei chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1329
 * Chain Name: Sei Network
 * Default Block Explorer: https://seitrace.com
 * Default RPC URL: https://evm-rpc.sei-apis.com/
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { sei } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: sei,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const sei = createCommon({
	...nativeDefineChain({
		id: 1329,
		name: 'Sei Network',
		nativeCurrency: {
			name: 'Sei',
			symbol: 'SEI',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://evm-rpc.sei-apis.com/'],
				webSocket: ['wss://evm-ws.sei-apis.com/'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Seitrace',
				url: 'https://seitrace.com',
				apiUrl: 'https://seitrace.com/pacific-1/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
