// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bitkubTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 25925
 * Chain Name: Bitkub Testnet
 * Default Block Explorer: https://testnet.bkcscan.com
 * Default RPC URL: https://rpc-testnet.bitkubchain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bitkubTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bitkubTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bitkubTestnet = createCommon({
	...nativeDefineChain({
		id: 25925,
		name: 'Bitkub Testnet',
		nativeCurrency: { name: 'Bitkub Test', symbol: 'tKUB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc-testnet.bitkubchain.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bitkub Chain Testnet Explorer',
				url: 'https://testnet.bkcscan.com',
				apiUrl: 'https://testnet.bkcscan.com/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
