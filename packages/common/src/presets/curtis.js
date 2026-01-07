// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the curtis chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 33111
 * Chain Name: Curtis
 * Default Block Explorer: https://explorer.curtis.apechain.com
 * Default RPC URL: https://rpc.curtis.apechain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { curtis } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: curtis,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const curtis = createCommon({
	...nativeDefineChain({
		id: 33111,
		name: 'Curtis',
		nativeCurrency: { name: 'ApeCoin', symbol: 'APE', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.curtis.apechain.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Curtis Explorer',
				url: 'https://explorer.curtis.apechain.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
