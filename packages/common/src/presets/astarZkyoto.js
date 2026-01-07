// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the astarZkyoto chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 6038361
 * Chain Name: Astar zkEVM Testnet zKyoto
 * Default Block Explorer: https://zkyoto.explorer.startale.com
 * Default RPC URL: https://rpc.startale.com/zkyoto
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { astarZkyoto } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: astarZkyoto,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const astarZkyoto = createCommon({
	...nativeDefineChain({
		id: 6038361,
		name: 'Astar zkEVM Testnet zKyoto',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.startale.com/zkyoto'],
			},
		},
		blockExplorers: {
			default: {
				name: 'zKyoto Explorer',
				url: 'https://zkyoto.explorer.startale.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 196153,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
