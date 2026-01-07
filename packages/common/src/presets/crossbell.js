// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the crossbell chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3737
 * Chain Name: Crossbell
 * Default Block Explorer: https://scan.crossbell.io
 * Default RPC URL: https://rpc.crossbell.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { crossbell } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: crossbell,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const crossbell = createCommon({
	...nativeDefineChain({
		id: 3737,
		name: 'Crossbell',
		nativeCurrency: { name: 'CSB', symbol: 'CSB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.crossbell.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'CrossScan',
				url: 'https://scan.crossbell.io',
				apiUrl: 'https://scan.crossbell.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 38246031,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
