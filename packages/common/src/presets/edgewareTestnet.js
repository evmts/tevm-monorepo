// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgewareTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2022
 * Chain Name: Beresheet BereEVM Testnet
 * Default Block Explorer: https://testnet.edgscan.live
 * Default RPC URL: https://beresheet-evm.jelliedowl.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgewareTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgewareTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgewareTestnet = createCommon({
	...nativeDefineChain({
		id: 2022,
		name: 'Beresheet BereEVM Testnet',
		nativeCurrency: { name: 'Testnet EDG', symbol: 'tEDG', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://beresheet-evm.jelliedowl.net'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Edgscan by Bharathcoorg',
				url: 'https://testnet.edgscan.live',
				apiUrl: 'https://testnet.edgscan.live/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
