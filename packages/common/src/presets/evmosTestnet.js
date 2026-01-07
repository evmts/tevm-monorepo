// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the evmosTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 9000
 * Chain Name: Evmos Testnet
 * Default Block Explorer: https://evm.evmos.dev/
 * Default RPC URL: https://eth.bd.evmos.dev:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { evmosTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: evmosTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const evmosTestnet = createCommon({
	...nativeDefineChain({
		id: 9000,
		name: 'Evmos Testnet',
		nativeCurrency: { name: 'Evmos', symbol: 'EVMOS', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://eth.bd.evmos.dev:8545'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Evmos Testnet Block Explorer',
				url: 'https://evm.evmos.dev/',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
