// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fibo chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 12306
 * Chain Name: Fibo Chain
 * Default Block Explorer: https://scan.fibochain.org
 * Default RPC URL: https://network.hzroc.art
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fibo } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fibo,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fibo = createCommon({
	...nativeDefineChain({
		id: 12306,
		name: 'Fibo Chain',
		nativeCurrency: { name: 'fibo', symbol: 'FIBO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://network.hzroc.art'],
			},
		},
		blockExplorers: {
			default: {
				name: 'FiboScan',
				url: 'https://scan.fibochain.org',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
