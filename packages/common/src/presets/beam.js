// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the beam chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4337
 * Chain Name: Beam
 * Default Block Explorer: https://subnets.avax.network/beam
 * Default RPC URL: https://build.onbeam.com/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { beam } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: beam,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const beam = createCommon({
	...nativeDefineChain({
		id: 4337,
		name: 'Beam',
		nativeCurrency: {
			name: 'Beam',
			symbol: 'BEAM',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://build.onbeam.com/rpc'],
				webSocket: ['wss://build.onbeam.com/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Beam Explorer',
				url: 'https://subnets.avax.network/beam',
			},
		},
		contracts: {
			multicall3: {
				address: '0x4956f15efdc3dc16645e90cc356eafa65ffc65ec',
				blockCreated: 1,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
