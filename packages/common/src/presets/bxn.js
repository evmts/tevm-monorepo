// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bxn chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4999
 * Chain Name: BlackFort Exchange Network
 * Default Block Explorer: https://explorer.blackfort.network
 * Default RPC URL: https://mainnet.blackfort.network/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bxn } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bxn,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bxn = createCommon({
	...nativeDefineChain({
		id: 4999,
		name: 'BlackFort Exchange Network',
		nativeCurrency: { name: 'BlackFort Token', symbol: 'BXN', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://mainnet.blackfort.network/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://explorer.blackfort.network',
				apiUrl: 'https://explorer.blackfort.network/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
