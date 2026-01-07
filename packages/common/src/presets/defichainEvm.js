// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the defichainEvm chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1130
 * Chain Name: DeFiChain EVM Mainnet
 * Default Block Explorer: https://meta.defiscan.live
 * Default RPC URL: https://eth.mainnet.ocean.jellyfishsdk.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { defichainEvm } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: defichainEvm,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const defichainEvm = createCommon({
	...nativeDefineChain({
		id: 1130,
		name: 'DeFiChain EVM Mainnet',
		nativeCurrency: { name: 'DeFiChain', symbol: 'DFI', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://eth.mainnet.ocean.jellyfishsdk.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DeFiScan',
				url: 'https://meta.defiscan.live',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 137852,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
