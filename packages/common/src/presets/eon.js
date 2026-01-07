// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the eon chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7332
 * Chain Name: Horizen EON
 * Default Block Explorer: https://eon-explorer.horizenlabs.io
 * Default RPC URL: https://eon-rpc.horizenlabs.io/ethv1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { eon } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: eon,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const eon = createCommon({
	...nativeDefineChain({
		id: 7332,
		name: 'Horizen EON',
		nativeCurrency: { name: 'ZEN', symbol: 'ZEN', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://eon-rpc.horizenlabs.io/ethv1'],
			},
		},
		blockExplorers: {
			default: {
				name: 'EON Explorer',
				url: 'https://eon-explorer.horizenlabs.io',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
