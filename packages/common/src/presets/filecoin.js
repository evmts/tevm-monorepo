// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the filecoin chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 314
 * Chain Name: Filecoin Mainnet
 * Default Block Explorer: https://filfox.info/en
 * Default RPC URL: https://api.node.glif.io/rpc/v1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { filecoin } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: filecoin,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const filecoin = createCommon({
	...nativeDefineChain({
		id: 314,
		name: 'Filecoin Mainnet',
		nativeCurrency: { name: 'filecoin', symbol: 'FIL', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.node.glif.io/rpc/v1'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Filfox',
				url: 'https://filfox.info/en',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 3328594,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
