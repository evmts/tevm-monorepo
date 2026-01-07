// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the wemixTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1112
 * Chain Name: WEMIX Testnet
 * Default Block Explorer: https://testnet.wemixscan.com
 * Default RPC URL: https://api.test.wemix.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { wemixTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: wemixTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const wemixTestnet = createCommon({
	...nativeDefineChain({
		id: 1112,
		name: 'WEMIX Testnet',
		nativeCurrency: { name: 'WEMIX', symbol: 'tWEMIX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.test.wemix.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'wemixExplorer',
				url: 'https://testnet.wemixscan.com',
				apiUrl: 'https://testnet.wemixscan.com/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
