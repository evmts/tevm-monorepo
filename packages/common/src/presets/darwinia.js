// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the darwinia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 46
 * Chain Name: Darwinia Network
 * Default Block Explorer: https://explorer.darwinia.network
 * Default RPC URL: https://rpc.darwinia.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { darwinia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: darwinia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const darwinia = createCommon({
	...nativeDefineChain({
		id: 46,
		name: 'Darwinia Network',
		nativeCurrency: { name: 'RING', symbol: 'RING', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.darwinia.network'],
				webSocket: ['wss://rpc.darwinia.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Explorer',
				url: 'https://explorer.darwinia.network',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 69420,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
