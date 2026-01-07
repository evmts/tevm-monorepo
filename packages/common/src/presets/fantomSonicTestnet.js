// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fantomSonicTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 64240
 * Chain Name: Fantom Sonic Open Testnet
 * Default Block Explorer: https://public-sonic.fantom.network
 * Default RPC URL: https://rpcapi.sonic.fantom.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fantomSonicTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fantomSonicTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fantomSonicTestnet = createCommon({
	...nativeDefineChain({
		id: 64240,
		name: 'Fantom Sonic Open Testnet',
		nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpcapi.sonic.fantom.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Fantom Sonic Open Testnet Explorer',
				url: 'https://public-sonic.fantom.network',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
