// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bearNetworkChainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 751230
 * Chain Name: Bear Network Chain Testnet
 * Default Block Explorer: https://brnktest-scan.bearnetwork.net
 * Default RPC URL: https://brnkc-test.bearnetwork.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bearNetworkChainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bearNetworkChainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bearNetworkChainTestnet = createCommon({
	...nativeDefineChain({
		id: 751230,
		name: 'Bear Network Chain Testnet',
		nativeCurrency: {
			name: 'tBRNKC',
			symbol: 'tBRNKC',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://brnkc-test.bearnetwork.net'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BrnkTestScan',
				url: 'https://brnktest-scan.bearnetwork.net',
				apiUrl: 'https://brnktest-scan.bearnetwork.net/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
