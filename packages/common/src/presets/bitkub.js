// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bitkub chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 96
 * Chain Name: KUB Mainnet
 * Default Block Explorer: https://www.bkcscan.com
 * Default RPC URL: https://rpc.bitkubchain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bitkub } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bitkub,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bitkub = createCommon({
	...nativeDefineChain({
		id: 96,
		name: 'KUB Mainnet',
		nativeCurrency: { name: 'KUB Coin', symbol: 'KUB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.bitkubchain.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'KUB Chain Mainnet Explorer',
				url: 'https://www.bkcscan.com',
				apiUrl: 'https://www.bkcscan.com/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
