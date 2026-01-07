// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the btr chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 200901
 * Chain Name: Bitlayer
 * Default Block Explorer: https://www.btrscan.com
 * Default RPC URL: https://rpc.bitlayer.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { btr } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: btr,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const btr = createCommon({
	...nativeDefineChain({
		id: 200901,
		name: 'Bitlayer',
		nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.bitlayer.org', 'https://rpc.bitlayer-rpc.com'],
				webSocket: ['wss://ws.bitlayer.org', 'wss://ws.bitlayer-rpc.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bitlayer(BTR) Scan',
				url: 'https://www.btrscan.com',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
