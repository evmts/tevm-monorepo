// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the shimmerTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1073
 * Chain Name: Shimmer Testnet
 * Default Block Explorer: https://explorer.evm.testnet.shimmer.network
 * Default RPC URL: https://json-rpc.evm.testnet.shimmer.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { shimmerTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: shimmerTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const shimmerTestnet = createCommon({
	...nativeDefineChain({
		id: 1073,
		name: 'Shimmer Testnet',
		nativeCurrency: { name: 'Shimmer', symbol: 'SMR', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://json-rpc.evm.testnet.shimmer.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Shimmer Network Explorer',
				url: 'https://explorer.evm.testnet.shimmer.network',
				apiUrl: 'https://explorer.evm.testnet.shimmer.network/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
