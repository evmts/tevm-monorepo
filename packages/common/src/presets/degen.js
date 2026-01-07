// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the degen chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 666666666
 * Chain Name: Degen
 * Default Block Explorer: https://explorer.degen.tips
 * Default RPC URL: https://rpc.degen.tips
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { degen } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: degen,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const degen = createCommon({
	...nativeDefineChain({
		id: 666666666,
		name: 'Degen',
		nativeCurrency: { name: 'Degen', symbol: 'DEGEN', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.degen.tips'],
				webSocket: ['wss://rpc.degen.tips'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Degen Chain Explorer',
				url: 'https://explorer.degen.tips',
				apiUrl: 'https://explorer.degen.tips/api/v2',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
