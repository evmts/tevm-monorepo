// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the chiliz chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 88888
 * Chain Name: Chiliz Chain
 * Default Block Explorer: https://scan.chiliz.com
 * Default RPC URL: https://rpc.chiliz.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { chiliz } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: chiliz,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const chiliz = createCommon({
	...nativeDefineChain({
		id: 88888,
		name: 'Chiliz Chain',
		nativeCurrency: { name: 'CHZ', symbol: 'CHZ', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.chiliz.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Chiliz Explorer',
				url: 'https://scan.chiliz.com',
				apiUrl: 'https://scan.chiliz.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 8080847,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
