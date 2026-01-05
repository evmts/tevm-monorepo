// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cronos chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 25
 * Chain Name: Cronos Mainnet
 * Default Block Explorer: https://explorer.cronos.org
 * Default RPC URL: https://evm.cronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cronos } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cronos,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cronos = createCommon({
	...nativeDefineChain({
		id: 25,
		name: 'Cronos Mainnet',
		nativeCurrency: {
			name: 'Cronos',
			symbol: 'CRO',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://evm.cronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Cronos Explorer',
				url: 'https://explorer.cronos.org',
				apiUrl: 'https://explorer-api.cronos.org/mainnet/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 1963112,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
