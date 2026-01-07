// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the sapphireTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 23295
 * Chain Name: Oasis Sapphire Testnet
 * Default Block Explorer: https://explorer.oasis.io/testnet/sapphire
 * Default RPC URL: https://testnet.sapphire.oasis.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { sapphireTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: sapphireTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const sapphireTestnet = createCommon({
	...nativeDefineChain({
		id: 23295,
		name: 'Oasis Sapphire Testnet',
		nativeCurrency: {
			name: 'Sapphire Test Rose',
			symbol: 'TEST',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://testnet.sapphire.oasis.dev'],
				webSocket: ['wss://testnet.sapphire.oasis.dev/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Oasis Explorer',
				url: 'https://explorer.oasis.io/testnet/sapphire',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
