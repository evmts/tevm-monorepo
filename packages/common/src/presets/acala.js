// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the acala chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 787
 * Chain Name: Acala
 * Default Block Explorer: https://blockscout.acala.network
 * Default RPC URL: https://eth-rpc-acala.aca-api.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { acala } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: acala,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const acala = createCommon({
	...nativeDefineChain({
		id: 787,
		name: 'Acala',
		nativeCurrency: {
			name: 'Acala',
			symbol: 'ACA',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://eth-rpc-acala.aca-api.network'],
				webSocket: ['wss://eth-rpc-acala.aca-api.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Acala Blockscout',
				url: 'https://blockscout.acala.network',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
