// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ekta chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1994
 * Chain Name: Ekta
 * Default Block Explorer: https://ektascan.io
 * Default RPC URL: https://main.ekta.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ekta } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ekta,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ekta = createCommon({
	...nativeDefineChain({
		id: 1994,
		name: 'Ekta',
		nativeCurrency: { name: 'EKTA', symbol: 'EKTA', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://main.ekta.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Ektascan',
				url: 'https://ektascan.io',
				apiUrl: 'https://ektascan.io/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
