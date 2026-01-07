// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bearNetworkChainMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 641230
 * Chain Name: Bear Network Chain Mainnet
 * Default Block Explorer: https://brnkscan.bearnetwork.net
 * Default RPC URL: https://brnkc-mainnet.bearnetwork.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bearNetworkChainMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bearNetworkChainMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bearNetworkChainMainnet = createCommon({
	...nativeDefineChain({
		id: 641230,
		name: 'Bear Network Chain Mainnet',
		nativeCurrency: {
			name: 'BearNetworkChain',
			symbol: 'BRNKC',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://brnkc-mainnet.bearnetwork.net'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BrnkScan',
				url: 'https://brnkscan.bearnetwork.net',
				apiUrl: 'https://brnkscan.bearnetwork.net/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
