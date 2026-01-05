// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the linea chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 59144
 * Chain Name: Linea Mainnet
 * Default Block Explorer: https://lineascan.build
 * Default RPC URL: https://rpc.linea.build
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { linea } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: linea,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const linea = createCommon({
	...nativeDefineChain({
		id: 59144,
		name: 'Linea Mainnet',
		nativeCurrency: {
			name: 'Linea Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.linea.build'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://lineascan.build',
				apiUrl: 'https://api.lineascan.build/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 42,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
