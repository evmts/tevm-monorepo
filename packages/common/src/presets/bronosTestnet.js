// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bronosTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1038
 * Chain Name: Bronos Testnet
 * Default Block Explorer: https://tbroscan.bronos.org
 * Default RPC URL: https://evm-testnet.bronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bronosTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bronosTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bronosTestnet = createCommon({
	...nativeDefineChain({
		id: 1038,
		name: 'Bronos Testnet',
		nativeCurrency: { name: 'Bronos Coin', symbol: 'tBRO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://evm-testnet.bronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BronoScan',
				url: 'https://tbroscan.bronos.org',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
