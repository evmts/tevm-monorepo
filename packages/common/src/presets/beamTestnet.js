// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the beamTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 13337
 * Chain Name: Beam Testnet
 * Default Block Explorer: https://subnets-test.avax.network/beam
 * Default RPC URL: https://build.onbeam.com/rpc/testnet
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { beamTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: beamTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const beamTestnet = createCommon({
	...nativeDefineChain({
		id: 13337,
		name: 'Beam Testnet',
		nativeCurrency: {
			name: 'Beam',
			symbol: 'BEAM',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://build.onbeam.com/rpc/testnet'],
				webSocket: ['wss://build.onbeam.com/ws/testnet'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Beam Explorer',
				url: 'https://subnets-test.avax.network/beam',
			},
		},
		contracts: {
			multicall3: {
				address: '0x9bf49b704ee2a095b95c1f2d4eb9010510c41c9e',
				blockCreated: 3,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
