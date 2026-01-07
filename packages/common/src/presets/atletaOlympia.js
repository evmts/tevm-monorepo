// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the atletaOlympia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2340
 * Chain Name: Atleta Olympia
 * Default Block Explorer: https://blockscout.atleta.network
 * Default RPC URL: https://testnet-rpc.atleta.network:9944
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { atletaOlympia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: atletaOlympia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const atletaOlympia = createCommon({
	...nativeDefineChain({
		id: 2340,
		name: 'Atleta Olympia',
		nativeCurrency: { decimals: 18, name: 'Atla', symbol: 'ATLA' },
		rpcUrls: {
			default: {
				http: [
					'https://testnet-rpc.atleta.network:9944',
					'https://testnet-rpc.atleta.network',
				],
			},
		},
		blockExplorers: {
			default: {
				name: 'Atleta Olympia Explorer',
				url: 'https://blockscout.atleta.network',
			},
		},
		contracts: {
			multicall3: {
				address: '0x1472ec6392180fb84F345d2455bCC75B26577115',
				blockCreated: 1076473,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
