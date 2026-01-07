// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dogechain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2000
 * Chain Name: Dogechain
 * Default Block Explorer: https://explorer.dogechain.dog
 * Default RPC URL: https://rpc.dogechain.dog
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dogechain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dogechain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dogechain = createCommon({
	...nativeDefineChain({
		id: 2000,
		name: 'Dogechain',
		nativeCurrency: { name: 'Wrapped Dogecoin', symbol: 'WDOGE', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.dogechain.dog'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DogeChainExplorer',
				url: 'https://explorer.dogechain.dog',
				apiUrl: 'https://explorer.dogechain.dog/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0x68a8609a60a008EFA633dfdec592c03B030cC508',
				blockCreated: 25384031,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
