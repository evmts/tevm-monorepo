// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the wemix chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1111
 * Chain Name: WEMIX
 * Default Block Explorer: https://explorer.wemix.com
 * Default RPC URL: https://api.wemix.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { wemix } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: wemix,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const wemix = createCommon({
	...nativeDefineChain({
		id: 1111,
		name: 'WEMIX',
		nativeCurrency: { name: 'WEMIX', symbol: 'WEMIX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.wemix.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'wemixExplorer',
				url: 'https://explorer.wemix.com',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
