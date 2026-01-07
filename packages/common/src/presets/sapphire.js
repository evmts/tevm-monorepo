// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the sapphire chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 23294
 * Chain Name: Oasis Sapphire
 * Default Block Explorer: https://explorer.oasis.io/mainnet/sapphire
 * Default RPC URL: https://sapphire.oasis.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { sapphire } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: sapphire,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const sapphire = createCommon({
	...nativeDefineChain({
		id: 23294,
		name: 'Oasis Sapphire',
		nativeCurrency: {
			name: 'Sapphire Rose',
			symbol: 'ROSE',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sapphire.oasis.io'],
				webSocket: ['wss://sapphire.oasis.io/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Oasis Explorer',
				url: 'https://explorer.oasis.io/mainnet/sapphire',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 734531,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
