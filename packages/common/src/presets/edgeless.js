// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgeless chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2026
 * Chain Name: Edgeless Network
 * Default Block Explorer: https://explorer.edgeless.network
 * Default RPC URL: https://rpc.edgeless.network/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgeless } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgeless,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgeless = createCommon({
	...nativeDefineChain({
		id: 2026,
		name: 'Edgeless Network',
		nativeCurrency: { name: 'Edgeless Wrapped ETH', symbol: 'EwETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.edgeless.network/http'],
				webSocket: ['wss://rpc.edgeless.network/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Edgeless Explorer',
				url: 'https://explorer.edgeless.network',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
