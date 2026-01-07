// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the moonbeam chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1284
 * Chain Name: Moonbeam
 * Default Block Explorer: https://moonscan.io
 * Default RPC URL: https://moonbeam.public.blastapi.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { moonbeam } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: moonbeam,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const moonbeam = createCommon({
	...nativeDefineChain({
		id: 1284,
		name: 'Moonbeam',
		nativeCurrency: {
			name: 'GLMR',
			symbol: 'GLMR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://moonbeam.public.blastapi.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Moonscan',
				url: 'https://moonscan.io',
				apiUrl: 'https://api-moonbeam.moonscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 609002,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
