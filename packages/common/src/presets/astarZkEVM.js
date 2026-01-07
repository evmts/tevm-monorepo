// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the astarZkEVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3776
 * Chain Name: Astar zkEVM
 * Default Block Explorer: https://astar-zkevm.explorer.startale.com
 * Default RPC URL: https://rpc-zkevm.astar.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { astarZkEVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: astarZkEVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const astarZkEVM = createCommon({
	...nativeDefineChain({
		id: 3776,
		name: 'Astar zkEVM',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc-zkevm.astar.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Astar zkEVM Explorer',
				url: 'https://astar-zkevm.explorer.startale.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 93528,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
