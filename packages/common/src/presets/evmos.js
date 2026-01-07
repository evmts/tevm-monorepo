// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the evmos chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 9001
 * Chain Name: Evmos
 * Default Block Explorer: https://escan.live
 * Default RPC URL: https://eth.bd.evmos.org:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { evmos } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: evmos,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const evmos = createCommon({
	...nativeDefineChain({
		id: 9001,
		name: 'Evmos',
		nativeCurrency: { name: 'Evmos', symbol: 'EVMOS', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://eth.bd.evmos.org:8545'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Evmos Block Explorer',
				url: 'https://escan.live',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
