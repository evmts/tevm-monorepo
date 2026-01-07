// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bxnTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4777
 * Chain Name: BlackFort Exchange Network Testnet
 * Default Block Explorer: https://testnet-explorer.blackfort.network
 * Default RPC URL: https://testnet.blackfort.network/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bxnTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bxnTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bxnTestnet = createCommon({
	...nativeDefineChain({
		id: 4777,
		name: 'BlackFort Exchange Network Testnet',
		nativeCurrency: { name: 'BlackFort Testnet Token', symbol: 'TBXN', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://testnet.blackfort.network/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://testnet-explorer.blackfort.network',
				apiUrl: 'https://testnet-explorer.blackfort.network/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
