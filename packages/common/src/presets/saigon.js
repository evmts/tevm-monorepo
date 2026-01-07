// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the saigon chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2021
 * Chain Name: Saigon Testnet
 * Default Block Explorer: https://saigon-app.roninchain.com
 * Default RPC URL: https://saigon-testnet.roninchain.com/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { saigon } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: saigon,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const saigon = createCommon({
	...nativeDefineChain({
		id: 2021,
		name: 'Saigon Testnet',
		nativeCurrency: {
			name: 'RON',
			symbol: 'RON',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://saigon-testnet.roninchain.com/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Saigon Explorer',
				url: 'https://saigon-app.roninchain.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 18736871,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
