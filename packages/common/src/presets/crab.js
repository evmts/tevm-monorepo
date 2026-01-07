// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the crab chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 44
 * Chain Name: Crab Network
 * Default Block Explorer: https://crab-scan.darwinia.network
 * Default RPC URL: https://crab-rpc.darwinia.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { crab } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: crab,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const crab = createCommon({
	...nativeDefineChain({
		id: 44,
		name: 'Crab Network',
		nativeCurrency: { name: 'Crab Network Native Token', symbol: 'CRAB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://crab-rpc.darwinia.network'],
				webSocket: ['wss://crab-rpc.darwinia.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://crab-scan.darwinia.network',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 3032593,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
