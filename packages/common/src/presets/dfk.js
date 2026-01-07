// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dfk chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 53935
 * Chain Name: DFK Chain
 * Default Block Explorer: https://subnets.avax.network/defi-kingdoms
 * Default RPC URL: https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dfk } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dfk,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dfk = createCommon({
	...nativeDefineChain({
		id: 53935,
		name: 'DFK Chain',
		nativeCurrency: { name: 'Jewel', symbol: 'JEWEL', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DFKSubnetScan',
				url: 'https://subnets.avax.network/defi-kingdoms',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 14790551,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
