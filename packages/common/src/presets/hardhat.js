// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hardhat chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 31337
 * Chain Name: Hardhat
 * Default Block Explorer: Not specified
 * Default RPC URL: http://127.0.0.1:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hardhat } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hardhat,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hardhat = createCommon({
	...nativeDefineChain({
		id: 31337,
		name: 'Hardhat',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['http://127.0.0.1:8545'],
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
