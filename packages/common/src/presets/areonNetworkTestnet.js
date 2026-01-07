// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the areonNetworkTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 462
 * Chain Name: Areon Network Testnet
 * Default Block Explorer: https://areonscan.com
 * Default RPC URL: https://testnet-rpc.areon.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { areonNetworkTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: areonNetworkTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const areonNetworkTestnet = createCommon({
	...nativeDefineChain({
		id: 462,
		name: 'Areon Network Testnet',
		nativeCurrency: {
			name: 'Areon',
			symbol: 'TAREA',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://testnet-rpc.areon.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'AreonScan',
				url: 'https://areonscan.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 0,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
