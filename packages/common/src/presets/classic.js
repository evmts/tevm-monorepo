// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the classic chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 61
 * Chain Name: Ethereum Classic
 * Default Block Explorer: https://blockscout.com/etc/mainnet
 * Default RPC URL: https://etc.rivet.link
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { classic } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: classic,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const classic = createCommon({
	...nativeDefineChain({
		id: 61,
		name: 'Ethereum Classic',
		nativeCurrency: { name: 'ETC', symbol: 'ETC', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://etc.rivet.link'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://blockscout.com/etc/mainnet',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
