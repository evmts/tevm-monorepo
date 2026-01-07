// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the berachainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 80085
 * Chain Name: Berachain Artio
 * Default Block Explorer: https://artio.beratrail.io
 * Default RPC URL: https://artio.rpc.berachain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { berachainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: berachainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const berachainTestnet = createCommon({
	...nativeDefineChain({
		id: 80085,
		name: 'Berachain Artio',
		nativeCurrency: {
			name: 'BERA Token',
			symbol: 'BERA',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://artio.rpc.berachain.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Berachain',
				url: 'https://artio.beratrail.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 866924,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
